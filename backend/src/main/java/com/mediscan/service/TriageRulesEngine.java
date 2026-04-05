package com.mediscan.service;

import com.mediscan.dto.ai.ExtractionResult;
import com.mediscan.model.Patient.Vitals;
import com.mediscan.model.enums.TriagePriority;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TriageRulesEngine {

    private static final Logger log = LoggerFactory.getLogger(TriageRulesEngine.class);

    public TriagePriority calculatePriority(ExtractionResult aiResult) {
        log.info("Calculating clinical priority for patient: {}", aiResult.getName());
        
        // 1. Check for Critical Vital Signs (Hard Safety Rules)
        Vitals vitals = aiResult.getVitals();
        if (vitals != null) {
            if (isCritical(vitals)) {
                log.warn("Critical vitals detected! Overriding AI suggestion to RED.");
                return TriagePriority.RED;
            }
            if (isUrgent(vitals)) {
                return TriagePriority.ORANGE;
            }
        }

        // 2. Fall back to AI Suggestion if vitals are stable
        try {
            return TriagePriority.valueOf(aiResult.getAiPrioritySuggestion());
        } catch (Exception e) {
            log.warn("Invalid AI priority suggestion: {}. Defaulting to YELLOW.", aiResult.getAiPrioritySuggestion());
            return TriagePriority.YELLOW;
        }
    }

    private boolean isCritical(Vitals vitals) {
        if (vitals.getOxygenSaturation() != null && vitals.getOxygenSaturation() < 90) return true;
        if (vitals.getHeartRate() != null && (vitals.getHeartRate() > 140 || vitals.getHeartRate() < 40)) return true;
        return false;
    }

    private boolean isUrgent(Vitals vitals) {
        if (vitals.getOxygenSaturation() != null && vitals.getOxygenSaturation() < 94) return true;
        if (vitals.getHeartRate() != null && (vitals.getHeartRate() > 120 || vitals.getHeartRate() < 50)) return true;
        return false;
    }
}
