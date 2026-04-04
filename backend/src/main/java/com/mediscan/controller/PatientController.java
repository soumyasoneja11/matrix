package com.mediscan.controller;

import com.mediscan.model.Patient;
import com.mediscan.service.PatientService;
import com.mediscan.dto.RegistrationRequest;
import com.mediscan.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/patients")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Patient>> registerPatient(@Valid @RequestBody RegistrationRequest request) {
        log.info("Received registration request for patient: {}", request.getName());
        Patient patient = patientService.registerPatient(request);
        return new ResponseEntity<>(ApiResponse.success(patient, "Patient registered successfully"), HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> getPatient(@PathVariable String id) {
        log.info("Received request to fetch patient ID: {}", id);
        Patient patient = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.success(patient, "Patient retrieved successfully"));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Patient>>> getAllPatients() {
        log.info("Received request to fetch all patients");
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(ApiResponse.success(patients, "All patients retrieved successfully"));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> updatePatient(@PathVariable String id, 
                                                               @Valid @RequestBody RegistrationRequest request) {
        log.info("Received request to update patient ID: {}", id);
        Patient updatedPatient = patientService.updatePatient(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedPatient, "Patient updated successfully"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable String id) {
        log.info("Received request to delete patient ID: {}", id);
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Patient deleted successfully"));
    }
}
