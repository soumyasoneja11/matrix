package com.mediscan.service;

import com.mediscan.model.Patient;
import com.mediscan.repository.PatientRepository;
import com.mediscan.dto.RegistrationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    public Patient registerPatient(RegistrationRequest request) {
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setSymptoms(request.getSymptoms());
        patient.setRegistrationDate(LocalDateTime.now());
        patient.setLastUpdated(LocalDateTime.now());
        
        return patientRepository.save(patient);
    }
    
    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }
    
    public Optional<Patient> getPatientByEmail(String email) {
        return patientRepository.findByEmail(email);
    }
    
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    
    public Patient updatePatient(String id, RegistrationRequest request) {
        Optional<Patient> existingPatient = patientRepository.findById(id);
        if (existingPatient.isPresent()) {
            Patient patient = existingPatient.get();
            patient.setName(request.getName());
            patient.setEmail(request.getEmail());
            patient.setPhoneNumber(request.getPhoneNumber());
            patient.setSymptoms(request.getSymptoms());
            patient.setLastUpdated(LocalDateTime.now());
            return patientRepository.save(patient);
        }
        return null;
    }
    
    public boolean deletePatient(String id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
}
