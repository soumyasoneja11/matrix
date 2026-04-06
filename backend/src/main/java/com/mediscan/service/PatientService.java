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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;

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

    @Transactional
    public Patient registerAndTriage(@NotNull RegistrationRequest request) {
        log.info("Starting intake for patient: {}", request.getName());

        // 1. AI Extraction
        ExtractionResult extractionResult = triageExtractor.extract(request.getSymptoms());

        // 2. Rules Engine
        TriagePriority priority = rulesEngine.calculatePriority(extractionResult);

        // 3. Create Patient (Mapping from Request + AI Result)
        Patient patient = Patient.builder()
                .name(request.getName() != null ? request.getName() : "Unknown")
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .age(extractionResult != null ? extractionResult.getAge() : 0)
                .gender(extractionResult != null ? extractionResult.getGender() : "Not Specified")
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
        return patientRepository.findByIsDeletedFalse();
    }

    public List<Patient> getRecycleBin() {
        return patientRepository.findByIsDeletedTrue();
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
}
