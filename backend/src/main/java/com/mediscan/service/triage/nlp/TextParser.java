package com.mediscan.service.triage.nlp;

import com.mediscan.dto.StructuredSymptoms;

public class TextParser {

    private final SmartSymptomExtractor extractor = new SmartSymptomExtractor();
    private final VitalExtractor vitalExtractor = new VitalExtractor();

    public StructuredSymptoms parse(String input) {

        input = HindiNormalizer.normalize(input);

        input = input.toLowerCase()
                .replaceAll("[^a-z0-9 ]", "")
                .trim();

        StructuredSymptoms s = new StructuredSymptoms();

        s.setHeartRate(80);
        s.setTemperature(37);
        s.setOxygenLevel(98);

        extractor.extract(input, s);
        vitalExtractor.extract(input, s);

        return s;
    }
}