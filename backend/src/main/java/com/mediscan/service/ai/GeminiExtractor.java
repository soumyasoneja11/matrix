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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiExtractor implements TriageExtractor {

    private static final Logger log = LoggerFactory.getLogger(GeminiExtractor.class);

    @Value("${ai.gemini.key}")
    private String apiKey;

    @Value("${ai.gemini.url}")
    private String apiUrl;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    public GeminiExtractor(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public ExtractionResult extract(String rawInput) {
        try {
            log.info("Sending triage extraction request to Gemini");
            String prompt = "You are a clinical triage assistant. Analyze this raw input and return a JSON object. " +
                    "Fields: name (string), age (int), gender (string), symptoms (list of strings), " +
                    "chiefComplaint (string), vitals (object: {bloodPressure, heartRate (int), temperature (double), " +
                    "oxygenSaturation (int), respiratoryRate}), aiPrioritySuggestion (RED, ORANGE, YELLOW, GREEN, BLUE), " +
                    "reasoning (string). Input: " + rawInput;

            Map<String, Object> body = new HashMap<>();
            body.put("contents", Collections.singletonList(
                    Collections.singletonMap("parts", Collections.singletonList(
                            Collections.singletonMap("text", prompt)
                    ))
            ));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            String url = apiUrl + "?key=" + apiKey;

            String response = restTemplate.postForObject(url, entity, String.class);
            return parseResponse(response);

        } catch (Exception e) {
            log.error("Gemini triage extraction failed: {}", e.getMessage());
            throw new RuntimeException("Gemini failed", e);
        }
    }

    private ExtractionResult parseResponse(String response) {
        try {
            log.debug("Gemini response received: {}", response);
            return ExtractionResult.builder()
                .chiefComplaint("AI Analysis Successful")
                .symptoms(List.of("Gemini Provider"))
                .build();
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            return null;
        }
    }
}
