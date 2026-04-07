package com.mediscan.service.ai;

import com.mediscan.dto.StructuredSymptoms;
import com.mediscan.dto.ai.ExtractionResult;
import com.mediscan.model.Patient;
import com.mediscan.service.triage.TextTriageService;
import com.mediscan.service.triage.nlp.TextParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Primary
public class ExtractionStrategyManager implements TriageExtractor {

    private static final Logger log = LoggerFactory.getLogger(ExtractionStrategyManager.class);

    private final TextTriageService textTriageService;
    private final TextParser textParser = new TextParser();

    public ExtractionStrategyManager(TextTriageService textTriageService) {
        this.textTriageService = textTriageService;
    }

    @Override
    public ExtractionResult extract(String rawInput) {
        try {
            log.info("Performing extraction with local ML + NLP strategy");
            String normalizedInput = rawInput == null ? "" : rawInput.trim();
            StructuredSymptoms parsed = textParser.parse(normalizedInput);
            List<String> extractedSymptoms = extractSymptoms(normalizedInput);

            String predictedLevel = textTriageService.predict(normalizedInput);
            String suggestion = mapLevelToSuggestion(predictedLevel);

            return ExtractionResult.builder()
                    .name("Unidentified Patient")
                    .age(extractAge(normalizedInput))
                    .gender(extractGender(normalizedInput))
                    .symptoms(extractedSymptoms)
                    .chiefComplaint(deriveChiefComplaint(extractedSymptoms, normalizedInput))
                    .vitals(mapVitals(parsed))
                    .aiPrioritySuggestion(suggestion)
                    .reasoning("Classified by local ML model trained from dataset and local NLP parsing")
                    .build();
        } catch (Exception e) {
            log.error("Local extraction failed. Returning minimal extraction result for manual review.", e);
            return ExtractionResult.builder()
                    .name("Unidentified Patient")
                    .age(0)
                    .gender("Unknown")
                    .chiefComplaint("Local ML extraction failed - record for manual review")
                    .symptoms(new ArrayList<>())
                    .build();
        }
    }

    private Integer extractAge(String input) {
        Matcher matcher = Pattern.compile("\\b(?:age\\s*[:=-]?\\s*)?(\\d{1,3})\\s*(?:years?|yrs?)?\\b", Pattern.CASE_INSENSITIVE).matcher(input);
        while (matcher.find()) {
            int age = Integer.parseInt(matcher.group(1));
            if (age >= 0 && age <= 130) {
                return age;
            }
        }
        return 0;
    }

    private String extractGender(String input) {
        String normalized = input.toLowerCase(Locale.ROOT);
        if (normalized.contains("female") || normalized.contains("woman") || normalized.contains("girl")) return "Female";
        if (normalized.contains("male") || normalized.contains("man") || normalized.contains("boy")) return "Male";
        return "Unknown";
    }

    private List<String> extractSymptoms(String input) {
        if (input.isBlank()) {
            return new ArrayList<>();
        }

        String cleaned = input
                .replaceAll("(?i)\\b(age|male|female|man|woman|boy|girl|years|yrs|year|hr|pulse|temp|spo2|oxygen)\\b", " ")
                .replaceAll("[^a-zA-Z0-9, ]", " ")
                .replaceAll("\\s+", " ")
                .trim();

        if (cleaned.isBlank()) {
            return new ArrayList<>();
        }

        String[] chunks = cleaned.split(",");
        List<String> symptoms = new ArrayList<>();
        for (String chunk : chunks) {
            String symptom = chunk.trim();
            if (!symptom.isBlank() && symptom.length() >= 3) {
                symptoms.add(symptom);
            }
        }
        return symptoms;
    }

    private String deriveChiefComplaint(List<String> symptoms, String raw) {
        if (!symptoms.isEmpty()) {
            return symptoms.get(0);
        }
        if (raw == null || raw.isBlank()) {
            return "No chief complaint captured";
        }
        return raw.length() > 80 ? raw.substring(0, 80) : raw;
    }

    private Patient.Vitals mapVitals(StructuredSymptoms parsed) {
        return Patient.Vitals.builder()
                .heartRate(parsed.getHeartRate())
                .temperature(parsed.getTemperature())
                .oxygenSaturation(parsed.getOxygenLevel())
                .build();
    }

    private String mapLevelToSuggestion(String level) {
        return switch (level) {
            case "CRITICAL" -> "RED";
            case "URGENT" -> "YELLOW";
            default -> "GREEN";
        };
    }
}
