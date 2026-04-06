package com.mediscan.service.triage.nlp;

import com.mediscan.dto.StructuredSymptoms;
import java.util.regex.*;

public class VitalExtractor {

    public void extract(String input, StructuredSymptoms s) {

        Matcher hr = Pattern.compile("(hr|pulse)\\s*(\\d+)").matcher(input);
        if (hr.find()) s.setHeartRate(Integer.parseInt(hr.group(2)));

        Matcher temp = Pattern.compile("(temp|bukhaar)\\s*(\\d+)").matcher(input);
        if (temp.find()) s.setTemperature(Double.parseDouble(temp.group(2)));

        Matcher oxy = Pattern.compile("(spo2|oxygen)\\s*(\\d+)").matcher(input);
        if (oxy.find()) s.setOxygenLevel(Integer.parseInt(oxy.group(2)));
    }
}