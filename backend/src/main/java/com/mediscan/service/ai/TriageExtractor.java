package com.mediscan.service.ai;

import com.mediscan.dto.ai.ExtractionResult;

public interface TriageExtractor {
    ExtractionResult extract(String rawInput);
}
