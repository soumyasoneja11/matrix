package com.mediscan.service.triage.ml;

import java.io.*;
import java.util.*;

public class TextDatasetLoader {

    public List<String> texts = new ArrayList<>();
    public List<Integer> labels = new ArrayList<>();

    public void load(String path) throws Exception {

        BufferedReader br = new BufferedReader(new FileReader(path));
        String line;

        br.readLine();

        while ((line = br.readLine()) != null) {
            String[] parts = line.split(",");

            texts.add(parts[0].replace("\"", ""));
            labels.add(Integer.parseInt(parts[1]));
        }

        br.close();
    }
}