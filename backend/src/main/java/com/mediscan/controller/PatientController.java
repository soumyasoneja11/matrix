package com.mediscan.controller;

import com.mediscan.dto.ApiResponse;
import com.mediscan.dto.RegistrationRequest;
import com.mediscan.model.Patient;
import com.mediscan.service.PatientService;
import com.mediscan.service.triage.TextTriageService;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@Validated
public class PatientController {

    private static final Logger log = LoggerFactory.getLogger(PatientController.class);

    private final PatientService patientService;
    private final TextTriageService textService;

    // ✅ CLEAN CONSTRUCTOR
    public PatientController(
            PatientService patientService,
            TextTriageService textService
    ) {
        this.patientService = patientService;
        this.textService = textService;
    }

    // 🔵 EXISTING (JSON based)
    @PostMapping("/triage")
    public ResponseEntity<ApiResponse<Patient>> intakeAndTriage(
            @Valid @RequestBody RegistrationRequest request) {

        log.info("Received intake request for: {}", request.getName());

        return ResponseEntity.ok(ApiResponse.success(
                patientService.registerAndTriage(request),
                "Patient registered and triaged successfully"
        ));
    }

    // 🔥 AI TEXT MODEL (MAIN FEATURE)
    @PostMapping(value = "/triage-ai", consumes = "text/plain")
    public ResponseEntity<String> aiTriage(@RequestBody String input) {

        log.info("AI INPUT: {}", input);

        String result = textService.predict(input);

        return ResponseEntity.ok(result);
    }

    // 🟢 GET ACTIVE
    @GetMapping
    public ResponseEntity<ApiResponse<List<Patient>>> getActivePatients() {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getActivePatients(),
                "Active patients retrieved successfully"
        ));
    }

    // 🟡 RECYCLE BIN
    @GetMapping("/recycle-bin")
    public ResponseEntity<ApiResponse<List<Patient>>> getRecycleBin() {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getRecycleBin(),
                "Recycle bin retrieved successfully"
        ));
    }

    // 🔴 DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> softDelete(@PathVariable String id) {
        patientService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Patient moved to recycle bin"));
    }
}