package com.mediscan.controller;

import com.mediscan.dto.ApiResponse;
import com.mediscan.dto.RegistrationRequest;
import com.mediscan.model.Patient;
import com.mediscan.service.PatientService;
import com.mediscan.service.triage.TextTriageService;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.requirePatientById(id),
                "Patient retrieved successfully"
        ));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Patient>>> search(@RequestParam(name = "q", required = false) String query) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.searchPatients(query),
                "Patient search completed"
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

    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Patient>> restore(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.restore(id),
                "Patient restored successfully"
        ));
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<ApiResponse<Void>> permanentDelete(@PathVariable String id) {
        patientService.permanentDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Patient permanently deleted"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> update(@PathVariable String id, @RequestBody Patient updates) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.updatePatient(id, updates),
                "Patient updated successfully"
        ));
    }

    @PatchMapping("/{id}/triage-level")
    public ResponseEntity<ApiResponse<Patient>> updateTriageLevel(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String triageLevel = payload != null ? payload.get("triageLevel") : null;
        return ResponseEntity.ok(ApiResponse.success(
                patientService.updateTriageLevel(id, triageLevel),
                "Patient triage level updated successfully"
        ));
    }

    @GetMapping("/my-worklist")
    public ResponseEntity<ApiResponse<List<Patient>>> getMyWorklist(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getWorklistForUser(username),
                "Worklist retrieved successfully"
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPatientHistoryRecords() {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getAllPatientHistoryRecords(),
                "Patient history records retrieved successfully"
        ));
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPatientHistoryRecordById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getPatientHistoryRecordById(id),
                "Patient history retrieved successfully"
        ));
    }
}