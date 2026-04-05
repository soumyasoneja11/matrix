package com.mediscan.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediscan.dto.ai.ExtractionResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceExtractor implements TriageExtractor {

    private static final Logger log = LoggerFactory.getLogger(HuggingFaceExtractor.class);

    @Value("${ai.huggingface.key}")
    private String apiKey;

    @Value("${ai.huggingface.url}")
    private String apiUrl;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public HuggingFaceExtractor(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public ExtractionResult extract(String rawInput) {
        try {
            log.info("Sending triage extraction request to Hugging Face (Failover)");
            
            Map<String, String> body = new HashMap<>();
            body.put("inputs", "Extract clinical vitals and symptoms from this text in JSON format: " + rawInput);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

            String response = restTemplate.postForObject(apiUrl, entity, String.class);
            return parseResponse(response);

        } catch (Exception e) {
            log.error("Hugging Face triage extraction failed: {}", e.getMessage());
            throw new RuntimeException("Hugging Face failed", e);
        }
    }

    private ExtractionResult parseResponse(String response) {
        log.debug("Hugging Face response received: {}", response);
        return ExtractionResult.builder()
                .chiefComplaint("Hugging Face Failover Successful")
                .symptoms(List.of("HuggingFace Provider"))
                .build();
    }
}
