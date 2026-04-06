package com.mediscan.service.triage.nlp;

import java.util.HashMap;
import java.util.Map;

public class HindiNormalizer {

    private static final Map<String, String> map = new HashMap<>();

    static {
        map.put("छाती", "chaati");
        map.put("दर्द", "dard");
        map.put("सांस", "saans");
        map.put("नहीं", "nahi");
        map.put("बुखार", "bukhaar");
        map.put("बेहोश", "behosh");
    }

    public static String normalize(String text) {
        for (Map.Entry<String, String> e : map.entrySet()) {
            text = text.replace(e.getKey(), e.getValue());
        }
        return text;
    }
}