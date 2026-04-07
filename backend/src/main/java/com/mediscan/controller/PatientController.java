package com.mediscan.controller;

import com.mediscan.dto.ApiResponse;
import com.mediscan.dto.RegistrationRequest;
import com.mediscan.model.Patient;
import com.mediscan.service.PatientService;
import com.mediscan.service.VoiceTranscriptionService;
import com.mediscan.service.triage.TextTriageService;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@Validated
public class PatientController {

    private static final Logger log = LoggerFactory.getLogger(PatientController.class);

    private final PatientService patientService;
    private final TextTriageService textService;
    private final VoiceTranscriptionService voiceTranscriptionService;

    public PatientController(
            PatientService patientService,
            TextTriageService textService,
            VoiceTranscriptionService voiceTranscriptionService
    ) {
        this.patientService = patientService;
        this.textService = textService;
        this.voiceTranscriptionService = voiceTranscriptionService;
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

    /** Multilingual voice: Gemini first, Hugging Face Whisper fallback. */
    @PostMapping(value = "/voice/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST','PATIENT')")
    public ResponseEntity<ApiResponse<Map<String, String>>> transcribeVoice(
            @RequestPart("audio") MultipartFile audio,
            @RequestParam(value = "mimeType", required = false) String mimeType) throws Exception {

        byte[] bytes = audio.getBytes();
        String mt = mimeType != null && !mimeType.isBlank()
                ? mimeType
                : (audio.getContentType() != null ? audio.getContentType() : "audio/webm");
        String text = voiceTranscriptionService.transcribe(bytes, mt);
        Map<String, String> payload = new HashMap<>();
        payload.put("text", text);
        return ResponseEntity.ok(ApiResponse.success(payload, "Transcription complete"));
    }

    // 🟢 GET ACTIVE (staff only)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<Patient>>> getActivePatients() {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getActivePatients(),
                "Active patients retrieved successfully"
        ));
    }

    /** Patient portal: own Mongo patient document */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Patient>> getMyPatientRecord(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getPatientForPortalUser(auth),
                "Patient record retrieved successfully"
        ));
    }

    /** Patient portal: own visit/history timeline */
    @GetMapping("/me/history")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyPatientHistory(Authentication auth) {
        var p = patientService.getPatientForPortalUser(auth);
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getPatientHistoryRecordById(p.getId()),
                "Patient history retrieved successfully"
        ));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<Patient>>> search(@RequestParam(name = "q", required = false) String query) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.searchPatients(query),
                "Patient search completed"
        ));
    }

    // 🟡 RECYCLE BIN
    @GetMapping("/recycle-bin")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<Patient>>> getRecycleBin() {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getRecycleBin(),
                "Recycle bin retrieved successfully"
        ));
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPatientHistoryRecords() {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getAllPatientHistoryRecords(),
                "Patient history records retrieved successfully"
        ));
    }

    @GetMapping("/history/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPatientHistoryRecordById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getPatientHistoryRecordById(id),
                "Patient history retrieved successfully"
        ));
    }

    @GetMapping("/my-worklist")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<Patient>>> getMyWorklist(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(ApiResponse.success(
                patientService.getWorklistForUser(username),
                "Worklist retrieved successfully"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> getById(@PathVariable String id, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.resolvePatientForViewer(id, auth),
                "Patient retrieved successfully"
        ));
    }

    // 🔴 DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<Void>> softDelete(@PathVariable String id) {
        patientService.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Patient moved to recycle bin"));
    }

    @PostMapping("/{id}/restore")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<Patient>> restore(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.restore(id),
                "Patient restored successfully"
        ));
    }

    @DeleteMapping("/{id}/permanent")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<Void>> permanentDelete(@PathVariable String id) {
        patientService.permanentDelete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Patient permanently deleted"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<Patient>> update(@PathVariable String id, @RequestBody Patient updates) {
        return ResponseEntity.ok(ApiResponse.success(
                patientService.updatePatient(id, updates),
                "Patient updated successfully"
        ));
    }

    @PatchMapping("/{id}/triage-level")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','NURSE','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<Patient>> updateTriageLevel(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String triageLevel = payload != null ? payload.get("triageLevel") : null;
        return ResponseEntity.ok(ApiResponse.success(
                patientService.updateTriageLevel(id, triageLevel),
                "Patient triage level updated successfully"
        ));
    }
}