package com.mediscan.service.triage.nlp;

import com.mediscan.dto.StructuredSymptoms;

public class SmartSymptomExtractor {

    private static final String[] chestPainWords = {
        "chest pain", "chestpain", "chaati dard", "seene dard"
    };

    private static final String[] breathingWords = {
        "breathing", "sob", "saans", "breath"
    };

    public void extract(String input, StructuredSymptoms s) {

        String[] tokens = input.split(" ");  // ✅ INSIDE METHOD

        for (String token : tokens) {

            for (String word : chestPainWords) {

                for (String w : word.split(" ")) {

                    if (FuzzyMatcher.similarity(token, w) > 0.7) {
                        s.setChestPain(true);
                    }
                }
            }

            for (String word : breathingWords) {

                for (String w : word.split(" ")) {

                    if (FuzzyMatcher.similarity(token, w) > 0.7) {
                        s.setBreathingDifficulty(true);
                    }
                }
            }

            if (FuzzyMatcher.similarity(token, "behosh") > 0.7) {
                s.setUnconscious(true);
            }
        }
    }
}