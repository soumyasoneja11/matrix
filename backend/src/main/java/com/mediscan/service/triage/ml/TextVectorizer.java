package com.mediscan.service.triage.ml;

import java.util.*;

public class TextVectorizer {

    private Map<String, Integer> vocab = new HashMap<>();

    public void build(List<String> texts) {
        int index = 0;

        for (String t : texts) {
            for (String w : tokenize(t)) {
                if (!vocab.containsKey(w)) {
                    vocab.put(w, index++);
                }
            }
        }
    }

    public double[] vectorize(String text) {
        double[] v = new double[vocab.size()];

        for (String w : tokenize(text)) {
            if (vocab.containsKey(w)) {
                v[vocab.get(w)]++;
            }
        }

        return v;
    }

    private List<String> tokenize(String t) {

    t = t.toLowerCase();

    // remove noise
    t = t.replaceAll("[^a-z0-9\\u0900-\\u097F ]", "");

    List<String> tokens = new ArrayList<>();

    String[] words = t.split("\\s+");

    for (String w : words) {

        tokens.add(w);

        // 🔥 ADD BIGRAMS (IMPORTANT)
        for (int i = 0; i < w.length() - 1; i++) {
            tokens.add(w.substring(i, i + 2));
        }
    }

    return tokens;
}

    public int size() {
        return vocab.size();
    }
}