package com.mediscan.controller;

import com.mediscan.dto.ApiResponse;
import com.mediscan.dto.RegistrationRequest;
import com.mediscan.model.Patient;
import com.mediscan.service.PatientService;
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
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/triage")
    public ResponseEntity<ApiResponse<Patient>> triagePatient(@Valid @RequestBody RegistrationRequest request) {
        Patient patient = patientService.registerAndTriage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(patient, "Patient registered and triaged successfully")
        );
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable String id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Patient>>> getActivePatients() {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getActivePatients(),
                "Active patients retrieved successfully"
        ));
    }

    @GetMapping("/recycle-bin")
    public ResponseEntity<ApiResponse<List<Patient>>> getRecycleBin() {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getRecycleBin(),
                "Recycle bin retrieved successfully"
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> softDelete(@PathVariable String id) {
        patientService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Patient moved to recycle bin"));
    }
}
