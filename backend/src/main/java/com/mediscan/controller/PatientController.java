package com.mediscan.controller;

import com.mediscan.model.Patient;
import com.mediscan.service.PatientService;
import com.mediscan.dto.RegistrationRequest;
import com.mediscan.dto.TriageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    @PostMapping("/register")
    public ResponseEntity<Patient> registerPatient(@Valid @RequestBody RegistrationRequest request) {
        Patient patient = patientService.registerPatient(request);
        return new ResponseEntity<>(patient, HttpStatus.CREATED);
    }

    @PostMapping("/triage")
    public ResponseEntity<Patient> triagePatient(@Valid @RequestBody TriageRequest request) {
        Patient patient = patientService.triagePatient(request);
        return new ResponseEntity<>(patient, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable String id) {
        Optional<Patient> patient = patientService.getPatientById(id);
        return patient.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable String id, 
                                                 @Valid @RequestBody RegistrationRequest request) {
        Patient updatedPatient = patientService.updatePatient(id, request);
        if (updatedPatient != null) {
            return ResponseEntity.ok(updatedPatient);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        if (patientService.deletePatient(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
}
