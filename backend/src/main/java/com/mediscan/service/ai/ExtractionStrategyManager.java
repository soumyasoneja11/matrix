package com.mediscan.service.ai;

import com.mediscan.dto.ai.ExtractionResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Primary
public class ExtractionStrategyManager implements TriageExtractor {

    private static final Logger log = LoggerFactory.getLogger(ExtractionStrategyManager.class);

    private final GeminiExtractor geminiExtractor;
    private final HuggingFaceExtractor huggingFaceExtractor;

    public ExtractionStrategyManager(GeminiExtractor geminiExtractor, HuggingFaceExtractor huggingFaceExtractor) {
        this.geminiExtractor = geminiExtractor;
        this.huggingFaceExtractor = huggingFaceExtractor;
    }

    @Override
    public ExtractionResult extract(String rawInput) {
        try {
            log.info("Attempting triage extraction with Primary Provider (Gemini)");
            return geminiExtractor.extract(rawInput);
        } catch (Exception e) {
            log.error("Primary Provider failed: {}. Attempting failover to Hugging Face", e.getMessage());
            try {
                return huggingFaceExtractor.extract(rawInput);
            } catch (Exception fatal) {
                log.error("All AI providers failed. Returning minimal extraction result for manual review.", fatal);
                // Return a safe fallback instead of crashing the transaction
                return ExtractionResult.builder()
                        .name("Unidentified Patient")
                        .age(0)
                        .gender("Unknown")
                        .chiefComplaint("AI Extraction Failed - Record for Manual Review")
                        .symptoms(new ArrayList<>())
                        .build();
            }
        }
    }
}
