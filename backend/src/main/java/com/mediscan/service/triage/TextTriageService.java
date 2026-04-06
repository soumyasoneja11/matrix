package com.mediscan.service.triage;

import com.mediscan.service.triage.ml.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TextTriageService {

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

            System.out.println("🔥 TEXT MODEL TRAINED");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String predict(String input) {

        double[] v = vectorizer.vectorize(input);
        int r = model.predict(v);

        return switch (r) {
            case 2 -> "CRITICAL";
            case 1 -> "URGENT";
            default -> "STANDARD";
        };
    }
}