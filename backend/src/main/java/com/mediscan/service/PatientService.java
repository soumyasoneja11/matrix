package com.mediscan.service;

import com.mediscan.dto.RegistrationRequest;
import com.mediscan.dto.ai.ExtractionResult;
import com.mediscan.model.Patient;
import com.mediscan.model.PatientEvent;
import com.mediscan.model.User;
import com.mediscan.model.enums.PatientStatus;
import com.mediscan.model.enums.Role;
import com.mediscan.model.enums.TriagePriority;
import com.mediscan.repository.PatientRepository;
import com.mediscan.repository.PatientEventRepository;
import com.mediscan.repository.UserRepository;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.service.ai.TriageExtractor;
import com.mediscan.service.triage.TextTriageService;

import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
@Validated
public class PatientService {

    private static final Logger log = LoggerFactory.getLogger(PatientService.class);

    private final PatientRepository patientRepository;
    private final PatientEventRepository eventRepository;
    private final UserRepository userRepository;
    private final TriageExtractor triageExtractor;
    private final ResourceAllocator resourceAllocator;
    private final SimpMessagingTemplate messagingTemplate;
    private final TextTriageService textTriageService; // 🔥 FIXED

    @Autowired
    public PatientService(PatientRepository patientRepository,
                          PatientEventRepository eventRepository,
                          UserRepository userRepository,
                          TriageExtractor triageExtractor,
                          ResourceAllocator resourceAllocator,
                          SimpMessagingTemplate messagingTemplate,
                          TextTriageService textTriageService) {

        this.patientRepository = patientRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.triageExtractor = triageExtractor;
        this.resourceAllocator = resourceAllocator;
        this.messagingTemplate = messagingTemplate;
        this.textTriageService = textTriageService; // 🔥 IMPORTANT FIX
    }

    // 🔵 BASIC REGISTER (NO AI)
    public Patient registerPatient(RegistrationRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        Patient patient = findExistingPatientForIntake(normalizedEmail).orElseGet(Patient::new);
        boolean isNew = patient.getId() == null;
        if (isNew) {
            patient.setCreatedAt(LocalDateTime.now());
        }

        patient.setName(request.getName());
        patient.setEmail(normalizedEmail);
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setRawSymptoms(request.getSymptoms());
        patient.setUpdatedAt(LocalDateTime.now());
        patient.setIsDeleted(false);

        Patient saved = patientRepository.save(patient);
        if (!isNew) {
            logEvent(saved, "INTAKE_UPDATE", "Existing patient intake updated", null, null, null, null);
        }
        return saved;
    }

    // 🔥 MAIN AI TRIAGE METHOD
    @Transactional
    public Patient registerAndTriage(@NotNull RegistrationRequest request) {
        log.info("Starting intake for patient: {}", request.getName());

        // 1. Extract structured data
        ExtractionResult extractionResult = triageExtractor.extract(request.getSymptoms());

        // 2. AI MODEL PREDICTION
        String aiResult = textTriageService.predict(request.getSymptoms());
        log.info("AI TRIAGE RESULT: {}", aiResult);

        // 3. MAP AI → ENUM
        TriagePriority priority = switch (aiResult) {
            case "CRITICAL" -> TriagePriority.RED;
            case "URGENT" -> TriagePriority.YELLOW;
            default -> TriagePriority.GREEN;
        };

        String normalizedEmail = normalizeEmail(request.getEmail());
        Optional<Patient> existingPatient = findExistingPatientForIntake(normalizedEmail);

        Patient patient = existingPatient.orElseGet(Patient::new);
        boolean isNewPatient = patient.getId() == null;

        if (isNewPatient) {
            patient.setCreatedAt(LocalDateTime.now());
        }

        patient.setName(request.getName() != null ? request.getName() : "Unknown");
        patient.setEmail(normalizedEmail);
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setAge(request.getAge() != null ? request.getAge() : (extractionResult != null ? extractionResult.getAge() : 0));
        patient.setGender(request.getGender() != null && !request.getGender().isBlank()
                ? request.getGender()
                : (extractionResult != null ? extractionResult.getGender() : "Unknown"));
        patient.setRawSymptoms(request.getSymptoms());
        patient.setExtractedSymptoms(extractionResult != null ? extractionResult.getSymptoms() : new ArrayList<>());
        patient.setChiefComplaint(extractionResult != null ? extractionResult.getChiefComplaint() : "No Chief Complaint");
        patient.setVitals(extractionResult != null ? extractionResult.getVitals() : new Patient.Vitals());
        patient.setPriority(priority);
        patient.setStatus(PatientStatus.TRIAGED);
        patient.setIsDeleted(false);
        patient.setUpdatedAt(LocalDateTime.now());

        Patient savedPatient = patientRepository.save(patient);

        // 5. RESOURCE ALLOCATION
        resourceAllocator.allocateResource(savedPatient);
        savedPatient = patientRepository.save(savedPatient);

        // 6. AUDIT LOG
        logEvent(savedPatient,
                isNewPatient ? "INTAKE" : "INTAKE_UPDATE",
                isNewPatient ? "New patient intake and AI triage completed" : "Existing patient revisit triage completed",
                null,
                PatientStatus.TRIAGED,
                null,
                priority);

        // 7. REAL-TIME UPDATE
        broadcastUpdate(savedPatient);

        return savedPatient;
    }

    // 🔵 FETCH
    public List<Patient> getActivePatients() {
        return sortByClinicalPriorityThenRecent(patientRepository.findByIsDeletedFalse());
    }

    public List<Patient> getRecycleBin() {
        return sortByClinicalPriorityThenRecent(patientRepository.findByIsDeletedTrue());
    }

    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }

    public Patient requirePatientById(@NotNull String id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    /** Logged-in PATIENT role: resolve Mongo patient record via linked id or email match. */
    public Patient getPatientForPortalUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResourceNotFoundException("Not authenticated");
        }
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() != Role.PATIENT) {
            throw new AccessDeniedException("This endpoint is for patient portal accounts only");
        }
        if (user.getLinkedPatientId() != null) {
            return requirePatientById(user.getLinkedPatientId());
        }
        String email = user.getEmail();
        if (email == null || email.isBlank()) {
            throw new ResourceNotFoundException("Account email is missing");
        }
        return patientRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No patient record linked to this email yet. It appears after your first visit."));
    }

    /** PATIENT may only open their own record; staff may open any. */
    public Patient resolvePatientForViewer(String patientId, Authentication auth) {
        Patient patient = requirePatientById(patientId);
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == Role.PATIENT) {
            Patient mine = getPatientForPortalUser(auth);
            if (!mine.getId().equals(patientId)) {
                throw new AccessDeniedException("You can only access your own medical record");
            }
        }
        return patient;
    }

    public List<Patient> searchPatients(String query) {
        List<Patient> activePatients = getActivePatients();
        if (query == null || query.isBlank()) {
            return activePatients;
        }

        String needle = query.toLowerCase(Locale.ROOT);
        return activePatients.stream()
                .filter(patient ->
                        containsIgnoreCase(patient.getName(), needle)
                                || containsIgnoreCase(patient.getEmail(), needle)
                                || containsIgnoreCase(patient.getPhoneNumber(), needle)
                                || containsIgnoreCase(patient.getChiefComplaint(), needle))
                .toList();
    }

    public List<Map<String, Object>> getAllPatientHistoryRecords() {
        return patientRepository.findAll().stream()
                .filter(p -> !Boolean.TRUE.equals(p.getIsDeleted()))
                .map(this::buildHistoryRecord)
                .toList();
    }

    public Map<String, Object> getPatientHistoryRecordById(String patientId) {
        Patient patient = requirePatientById(patientId);
        return buildHistoryRecord(patient);
    }

    public List<Patient> getWorklistForUser(String username) {
        List<Patient> activePatients = getActivePatients();
        var user = userRepository.findByUsername(username).orElse(null);
        if (user == null || user.getRole() == null) {
            return activePatients;
        }

        String role = user.getRole().name();
        String fullName = user.getFullName() != null ? user.getFullName() : username;

        if ("DOCTOR".equals(role)) {
            List<Patient> doctorAssigned = activePatients.stream()
                    .filter(p -> matchesAssignee(p.getAssignedDoctorId(), username)
                            || matchesAssignee(p.getAssignedStaff(), fullName))
                    .toList();
            return doctorAssigned.isEmpty() ? activePatients : doctorAssigned;
        }

        if ("NURSE".equals(role)) {
            List<Patient> nurseAssigned = activePatients.stream()
                    .filter(p -> matchesAssignee(p.getAssignedNurseId(), username)
                            || matchesAssignee(p.getAssignedStaff(), fullName))
                    .toList();
            return nurseAssigned.isEmpty() ? activePatients : nurseAssigned;
        }

        return activePatients;
    }

    // 🔴 DELETE
    @Transactional
    public void softDelete(@NotNull String id) {
        Patient patient = requirePatientById(id);

        patient.setIsDeleted(true);
        patientRepository.save(patient);

        logEvent(patient,
                "DISMISS",
                "Patient moved to recycle bin",
                null,
                null,
                null,
                null);

        broadcastUpdate(patient);
    }

    @Transactional
    public Patient restore(@NotNull String id) {
        Patient patient = requirePatientById(id);
        patient.setIsDeleted(false);
        patient.setUpdatedAt(LocalDateTime.now());

        Patient saved = patientRepository.save(patient);
        logEvent(saved, "RESTORE", "Patient restored from recycle bin", null, null, null, null);
        broadcastUpdate(saved);
        return saved;
    }

    @Transactional
    public void permanentDelete(@NotNull String id) {
        Patient patient = requirePatientById(id);
        patientRepository.deleteById(id);
        log.info("Permanently deleted patient {}", patient.getId());
    }

    @Transactional
    public Patient updatePatient(@NotNull String id, @NotNull Patient updates) {
        Patient patient = requirePatientById(id);

        if (updates.getName() != null && !updates.getName().isBlank()) patient.setName(updates.getName().trim());
        if (updates.getEmail() != null) patient.setEmail(updates.getEmail().trim());
        if (updates.getPhoneNumber() != null && !updates.getPhoneNumber().isBlank()) patient.setPhoneNumber(updates.getPhoneNumber().trim());
        if (updates.getAge() != null) patient.setAge(updates.getAge());
        if (updates.getGender() != null) patient.setGender(updates.getGender().trim());
        if (updates.getRawSymptoms() != null) patient.setRawSymptoms(updates.getRawSymptoms());
        if (updates.getChiefComplaint() != null) patient.setChiefComplaint(updates.getChiefComplaint());
        if (updates.getDescription() != null) patient.setDescription(updates.getDescription());
        if (updates.getExtractedSymptoms() != null) patient.setExtractedSymptoms(updates.getExtractedSymptoms());
        if (updates.getStatus() != null) patient.setStatus(updates.getStatus());
        if (updates.getPriority() != null) patient.setPriority(updates.getPriority());
        if (updates.getVitals() != null) patient.setVitals(updates.getVitals());

        patient.setUpdatedAt(LocalDateTime.now());
        Patient saved = patientRepository.save(patient);
        broadcastUpdate(saved);
        return saved;
    }

    @Transactional
    public Patient updateTriageLevel(@NotNull String id, String level) {
        Patient patient = requirePatientById(id);
        patient.setPriority(mapTriageLevel(level));
        patient.setUpdatedAt(LocalDateTime.now());

        Patient saved = patientRepository.save(patient);
        logEvent(saved, "TRIAGE_UPDATE", "Triage level updated", null, null, null, saved.getPriority());
        broadcastUpdate(saved);
        return saved;
    }

    // 🧾 EVENTS
    private void logEvent(Patient patient,
                          String type,
                          String desc,
                          PatientStatus prevStatus,
                          PatientStatus nextStatus,
                          TriagePriority prevPri,
                          TriagePriority nextPri) {

        PatientEvent event = PatientEvent.builder()
                .patientId(patient.getId())
                .eventType(type)
                .description(desc)
                .prevStatus(prevStatus)
                .nextStatus(nextStatus)
                .prevPriority(prevPri)
                .nextPriority(nextPri)
                .build();

        eventRepository.save(event);
    }

    // 📡 REAL-TIME
    private void broadcastUpdate(Patient patient) {
        messagingTemplate.convertAndSend("/topic/patients", patient);
    }

    // 🔥 SORTING
    private List<Patient> sortByClinicalPriorityThenRecent(List<Patient> patients) {
        Comparator<Patient> comparator = Comparator
                .comparingInt((Patient p) -> priorityRank(p.getPriority()))
                .thenComparing(Patient::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(Patient::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder()));

        return patients.stream().sorted(comparator).toList();
    }

    private int priorityRank(TriagePriority priority) {
        if (priority == null) return Integer.MAX_VALUE;

        return switch (priority) {
            case RED -> 0;
            case ORANGE -> 1;
            case YELLOW -> 2;
            case GREEN -> 3;
            case BLUE -> 4;
        };
    }

    private boolean containsIgnoreCase(String value, String needleLower) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(needleLower);
    }

    private Map<String, Object> buildHistoryRecord(Patient patient) {
        Map<String, Object> record = new HashMap<>();
        record.put("id", patient.getId());
        record.put("name", patient.getName());
        record.put("age", patient.getAge());
        record.put("gender", patient.getGender());
        record.put("contactPhone", patient.getPhoneNumber());
        record.put("contactEmail", patient.getEmail());
        record.put("visits", buildVisitEntries(patient));
        return record;
    }

    private List<Map<String, Object>> buildVisitEntries(Patient patient) {
        List<Map<String, Object>> visits = new ArrayList<>();
        List<PatientEvent> events = eventRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId());
        for (PatientEvent event : events) {
            visits.add(buildVisit(patient, event.getId(), event.getCreatedAt(), event.getDescription()));
        }
        if (visits.isEmpty()) {
            String fallbackId = "initial-" + patient.getId();
            visits.add(buildVisit(patient, fallbackId, patient.getUpdatedAt(), patient.getDescription()));
        }
        return visits;
    }

    private Map<String, Object> buildVisit(Patient patient, String visitId, LocalDateTime visitDate, String notes) {
        Map<String, Object> visit = new HashMap<>();
        visit.put("id", visitId);
        visit.put("date", visitDate != null ? visitDate : patient.getCreatedAt());
        visit.put("complaint", nonBlank(patient.getChiefComplaint(), patient.getRawSymptoms(), "Clinical visit"));
        visit.put("symptoms", patient.getExtractedSymptoms() != null ? patient.getExtractedSymptoms() : List.of());
        visit.put("vitals", patient.getVitals());
        visit.put("triageLevel", patient.getDisplayPriority());
        visit.put("assignedDoctor", patient.getAssignedDoctorId());
        visit.put("assignedNurse", patient.getAssignedNurseId());
        visit.put("department", nonBlank(patient.getLocation(), "Emergency Department"));
        visit.put("medicines", List.of());
        visit.put("procedures", List.of());
        visit.put("notes", nonBlank(notes, patient.getDescription(), "Clinical record update"));
        visit.put("status", mapHistoryStatus(patient.getStatus() != null ? patient.getStatus().name() : null));
        return visit;
    }

    private String mapHistoryStatus(String status) {
        if (status == null) return "completed";
        return switch (status) {
            case "TRIAGED", "IN_TREATMENT", "OBSERVATION" -> "ongoing";
            case "DISCHARGED" -> "completed";
            default -> "follow-up";
        };
    }

    private String nonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) return value;
        }
        return "";
    }

    private boolean matchesAssignee(String fieldValue, String expected) {
        if (fieldValue == null || expected == null) return false;
        return fieldValue.trim().equalsIgnoreCase(expected.trim());
    }

    private Optional<Patient> findExistingPatientForIntake(String normalizedEmail) {
        if (normalizedEmail == null || normalizedEmail.isBlank()) {
            return Optional.empty();
        }
        return patientRepository.findByEmail(normalizedEmail);
    }

    private String normalizeEmail(String email) {
        if (email == null) return null;
        String trimmed = email.trim();
        return trimmed.isBlank() ? null : trimmed.toLowerCase(Locale.ROOT);
    }

    private TriagePriority mapTriageLevel(String level) {
        if (level == null) return TriagePriority.GREEN;

        String normalized = level.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "CRITICAL", "RED" -> TriagePriority.RED;
            case "URGENT", "ORANGE", "YELLOW" -> TriagePriority.YELLOW;
            case "STANDARD", "GREEN", "BLUE" -> TriagePriority.GREEN;
            default -> TriagePriority.GREEN;
        };
    }
}