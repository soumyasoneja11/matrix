package com.mediscan.service.triage.ml;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class TextDatasetLoader {

    public List<String> texts = new ArrayList<>();
    public List<Integer> labels = new ArrayList<>();

    public void load(String path) throws Exception {
        texts.clear();
        labels.clear();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(openInput(path), StandardCharsets.UTF_8))) {
            String line = br.readLine(); // skip header
            if (line == null) {
                return;
            }

            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",", 2);
                if (parts.length < 2) {
                    continue;
                }

                String text = parts[0].replace("\"", "").trim();
                String labelRaw = parts[1].replace("\"", "").trim();
                if (text.isBlank() || labelRaw.isBlank()) {
                    continue;
                }

                try {
                    texts.add(text);
                    labels.add(Integer.parseInt(labelRaw));
                } catch (NumberFormatException ignored) {
                    // Skip malformed rows safely.
                }
            }
        }
    }

    private InputStream openInput(String path) throws FileNotFoundException {
        String resourcePath = path.startsWith("src/main/resources/")
                ? path.substring("src/main/resources/".length())
                : path;
        InputStream classpath = getClass().getClassLoader().getResourceAsStream(resourcePath);
        if (classpath != null) {
            return classpath;
        }
        return new FileInputStream(path);
    }
}