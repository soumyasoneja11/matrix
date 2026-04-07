package com.mediscan.service.triage;

import com.mediscan.service.triage.ml.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TextTriageService {

    private static final Logger log = LoggerFactory.getLogger(TextTriageService.class);

    private TriageModel model;
    private TextVectorizer vectorizer;

    public TextTriageService() {

        try {
            TextDatasetLoader loader = new TextDatasetLoader();
            loader.load("src/main/resources/data_text.csv");

            vectorizer = new TextVectorizer();
            vectorizer.build(loader.texts);

            List<DataPoint> data = new ArrayList<>();

            for (int i = 0; i < loader.texts.size(); i++) {
                double[] v = vectorizer.vectorize(loader.texts.get(i));
                data.add(new DataPoint(v, loader.labels.get(i)));
            }

            model = new TriageModel(vectorizer.size());

            Trainer t = new Trainer();
            t.train(model, data);

            log.info("Text triage model trained successfully");

        } catch (Exception e) {
            log.error("Text triage model training failed; using keyword fallback", e);
            model = null;
            vectorizer = null;
        }
    }

    public String predict(String input) {
        if (input == null || input.isBlank()) {
            return "STANDARD";
        }

        if (vectorizer == null || model == null) {
            return predictByKeywordFallback(input);
        }

        double[] v = vectorizer.vectorize(input);
        int r = model.predict(v);

        return switch (r) {
            case 2 -> "CRITICAL";
            case 1 -> "URGENT";
            default -> "STANDARD";
        };
    }

    private String predictByKeywordFallback(String input) {
        String normalized = input.toLowerCase(Locale.ROOT);
        if (containsAny(normalized, "unconscious", "cardiac arrest", "no pulse", "severe bleeding", "stroke")) {
            return "CRITICAL";
        }
        if (containsAny(normalized, "chest pain", "shortness of breath", "high fever", "fracture", "vomiting")) {
            return "URGENT";
        }
        return "STANDARD";
    }

    private boolean containsAny(String source, String... tokens) {
        for (String token : tokens) {
            if (source.contains(token)) return true;
        }
        return false;
    }
}