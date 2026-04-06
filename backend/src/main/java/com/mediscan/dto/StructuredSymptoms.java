package com.mediscan.dto;

import java.util.List;
import java.util.ArrayList;

/**
 * Standard Java DTO for Structured Symptoms (No Lombok).
 */
public class StructuredSymptoms {
    
    private List<String> symptoms = new ArrayList<>();
    private String severity;
    private String duration;
    private String likely_diagnoses;
    private String recommendations;
    private String emergency_warning_signs;

    public StructuredSymptoms() {}

    public StructuredSymptoms(List<String> symptoms, String severity, String duration, 
                              String likely_diagnoses, String recommendations, String emergency_warning_signs) {
        this.symptoms = symptoms;
        this.severity = severity;
        this.duration = duration;
        this.likely_diagnoses = likely_diagnoses;
        this.recommendations = recommendations;
        this.emergency_warning_signs = emergency_warning_signs;
    }

    // Getters and Setters
    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getLikely_diagnoses() { return likely_diagnoses; }
    public void setLikely_diagnoses(String likely_diagnoses) { this.likely_diagnoses = likely_diagnoses; }
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    public String getEmergency_warning_signs() { return emergency_warning_signs; }
    public void setEmergency_warning_signs(String emergency_warning_signs) { this.emergency_warning_signs = emergency_warning_signs; }
}
