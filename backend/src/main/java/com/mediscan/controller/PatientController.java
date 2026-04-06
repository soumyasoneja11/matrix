package com.mediscan.controller;

import com.mediscan.dto.ApiResponse;
import com.mediscan.dto.RegistrationRequest;
import com.mediscan.model.Patient;
import com.mediscan.service.PatientService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private static final Logger log = LoggerFactory.getLogger(PatientController.class);

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/triage")
    public ResponseEntity<ApiResponse<Patient>> intakeAndTriage(@Valid @RequestBody RegistrationRequest request) {
        log.info("Received intake request for: {}", request.getName());
        return ResponseEntity.ok(ApiResponse.success(
                patientService.registerAndTriage(request),
                "Patient registered and triaged successfully"
        ));
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
