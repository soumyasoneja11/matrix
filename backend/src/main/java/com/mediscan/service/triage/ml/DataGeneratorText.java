package com.mediscan.service.triage.ml;

import java.io.FileWriter;
import java.util.Random;

public class DataGeneratorText {

    static String[] critical = {
            "chest pain breathing problem",
            "chaati me dard saans nahi aa rahi",
            "behosh ho gaya pulse high",
            "spo2 low breathing issue",
            "severe chest tightness cannot breathe",
            "oxygen low patient unconscious"
    };

    static String[] urgent = {
            "bukhaar high fever",
            "mild chest pain",
            "dizziness and weakness",
            "fever 102 body pain",
            "light breathing problem"
    };

    static String[] normal = {
            "normal cold cough",
            "mild headache",
            "no major issue",
            "slight fever stable",
            "general weakness"
    };

    public static void main(String[] args) throws Exception {

        FileWriter writer = new FileWriter("src/main/resources/data_text.csv");
        writer.write("text,label\n");

        Random rand = new Random();

        for (int i = 0; i < 1200; i++) {

            int type = rand.nextInt(3);
            String text;

            if (type == 2) {
                text = critical[rand.nextInt(critical.length)];
            } else if (type == 1) {
                text = urgent[rand.nextInt(urgent.length)];
            } else {
                text = normal[rand.nextInt(normal.length)];
            }

            // add noise (typos simulation)
            if (rand.nextBoolean()) text = text.replace("a", "");
            if (rand.nextBoolean()) text += " " + rand.nextInt(150);

            writer.write("\"" + text + "\"," + type + "\n");
        }

        writer.close();
        System.out.println("✅ 1200 dataset generated");
    }
}