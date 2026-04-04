package com.mediscan.service;

import com.mediscan.model.Patient;
import com.mediscan.repository.PatientRepository;
import com.mediscan.dto.RegistrationRequest;
import com.mediscan.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    public Patient registerPatient(RegistrationRequest request) {
        log.info("Registering new patient: {}", request.getName());
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setSymptoms(request.getSymptoms());
        patient.setRegistrationDate(LocalDateTime.now());
        patient.setLastUpdated(LocalDateTime.now());
        
        Patient savedPatient = patientRepository.save(patient);
        log.info("Successfully registered patient with ID: {}", savedPatient.getId());
        return savedPatient;
    }
    
    public Patient getPatientById(String id) {
        log.debug("Fetching patient by ID: {}", id);
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));
    }
    
    public Patient getPatientByEmail(String email) {
        log.debug("Fetching patient by email: {}", email);
        return patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));
    }
    
    public List<Patient> getAllPatients() {
        log.debug("Fetching all patients");
        return patientRepository.findAll();
    }
    
    public Patient updatePatient(String id, RegistrationRequest request) {
        log.info("Updating patient ID: {}", id);
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));
        
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setSymptoms(request.getSymptoms());
        patient.setLastUpdated(LocalDateTime.now());
        
        Patient updatedPatient = patientRepository.save(patient);
        log.info("Successfully updated patient ID: {}", id);
        return updatedPatient;
    }
    
    public void deletePatient(String id) {
        log.info("Deleting patient ID: {}", id);
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with ID: " + id);
        }
        patientRepository.deleteById(id);
        log.info("Successfully deleted patient ID: {}", id);
    }
}
