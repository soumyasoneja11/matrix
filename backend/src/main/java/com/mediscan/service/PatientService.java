package com.mediscan.service;

import com.mediscan.dto.RegistrationRequest;
import com.mediscan.dto.ai.ExtractionResult;
import com.mediscan.model.Patient;
import com.mediscan.model.PatientEvent;
import com.mediscan.model.enums.PatientStatus;
import com.mediscan.model.enums.TriagePriority;
import com.mediscan.repository.PatientRepository;
import com.mediscan.repository.PatientEventRepository;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.service.ai.TriageExtractor;
import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Validated
public class PatientService {

    private static final Logger log = LoggerFactory.getLogger(PatientService.class);

    private final PatientRepository patientRepository;
    private final PatientEventRepository eventRepository;
    private final TriageExtractor triageExtractor;
    private final TriageRulesEngine rulesEngine;
    private final ResourceAllocator resourceAllocator;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public PatientService(PatientRepository patientRepository,
                          PatientEventRepository eventRepository,
                          TriageExtractor triageExtractor,
                          TriageRulesEngine rulesEngine,
                          ResourceAllocator resourceAllocator,
                          SimpMessagingTemplate messagingTemplate) {
        this.patientRepository = patientRepository;
        this.eventRepository = eventRepository;
        this.triageExtractor = triageExtractor;
        this.rulesEngine = rulesEngine;
        this.resourceAllocator = resourceAllocator;
        this.messagingTemplate = messagingTemplate;
    }
    
    public Patient registerPatient(RegistrationRequest request) {
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setRawSymptoms(request.getSymptoms());
        patient.setCreatedAt(LocalDateTime.now());
        patient.setUpdatedAt(LocalDateTime.now());
        
        return patientRepository.save(patient);
    }

    @Transactional
    public Patient registerAndTriage(@NotNull RegistrationRequest request) {
        log.info("Starting intake for patient: {}", request.getName());

        // 1. AI Extraction
        ExtractionResult extractionResult = triageExtractor.extract(request.getSymptoms());

        // 2. Rules Engine
        TriagePriority priority = rulesEngine.calculatePriority(extractionResult);

        // 3. Create Patient (Mapping from Request + AI Result)
        Integer inferredAge = extractionResult != null ? extractionResult.getAge() : 0;
        String inferredGender = extractionResult != null ? extractionResult.getGender() : "Not Specified";

        Patient patient = Patient.builder()
                .name(request.getName() != null ? request.getName() : "Unknown")
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
            .age(request.getAge() != null ? request.getAge() : inferredAge)
            .gender(request.getGender() != null && !request.getGender().isBlank() ? request.getGender() : inferredGender)
                .rawSymptoms(request.getSymptoms())
                .extractedSymptoms(extractionResult != null ? extractionResult.getSymptoms() : new java.util.ArrayList<>())
                .chiefComplaint(extractionResult != null ? extractionResult.getChiefComplaint() : "No Chief Complaint")
                .vitals(extractionResult != null ? extractionResult.getVitals() : new Patient.Vitals())
                .priority(priority)
                .status(PatientStatus.TRIAGED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Patient savedPatient = patientRepository.save(patient);

        // 4. Resource Allocation
        resourceAllocator.allocateResource(savedPatient);
        savedPatient = patientRepository.save(savedPatient);

        // 5. Audit Logging
        logEvent(savedPatient, "INTAKE", "New patient intake and AI triage completed", null, PatientStatus.TRIAGED, null, priority);

        // 6. Broadcast Real-time
        broadcastUpdate(savedPatient);

        return savedPatient;
    }

    public List<Patient> getActivePatients() {
        return sortByClinicalPriorityThenRecent(patientRepository.findByIsDeletedFalse());
    }

    public List<Patient> getRecycleBin() {
        return sortByClinicalPriorityThenRecent(patientRepository.findByIsDeletedTrue());
    }
    
    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }

    @Transactional
    public void softDelete(@NotNull String id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patient.setIsDeleted(true);
        patientRepository.save(patient);
        logEvent(patient, "DISMISS", "Patient moved to recycle bin", null, null, null, null);
        broadcastUpdate(patient);
    }

    private void logEvent(Patient patient, String type, String desc, PatientStatus prevStatus, PatientStatus nextStatus, TriagePriority prevPri, TriagePriority nextPri) {
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

    private void broadcastUpdate(Patient patient) {
        messagingTemplate.convertAndSend("/topic/patients", patient);
    }

    private List<Patient> sortByClinicalPriorityThenRecent(List<Patient> patients) {
        Comparator<Patient> comparator = Comparator
                .comparingInt((Patient p) -> priorityRank(p.getPriority()))
                .thenComparing(Patient::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(Patient::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder()));

        return patients.stream().sorted(comparator).toList();
    }

    private int priorityRank(TriagePriority priority) {
        if (priority == null) {
            return Integer.MAX_VALUE;
        }
        return switch (priority) {
            case RED -> 0;
            case ORANGE -> 1;
            case YELLOW -> 2;
            case GREEN -> 3;
            case BLUE -> 4;
        };
    }
}
