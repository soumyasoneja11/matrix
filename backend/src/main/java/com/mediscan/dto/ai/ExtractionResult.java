package com.mediscan.dto.ai;

import com.mediscan.model.Patient.Vitals;
import java.util.List;

/**
 * Standard Java DTO for AI Extraction results (No Lombok).
 */
public class ExtractionResult {
    private String name;
    private Integer age;
    private String gender;
    private List<String> symptoms;
    private String chiefComplaint;
    private Vitals vitals;
    private String aiPrioritySuggestion;
    private String reasoning;

    public ExtractionResult() {}

    public ExtractionResult(String name, Integer age, String gender, List<String> symptoms, 
                            String chiefComplaint, Vitals vitals, String aiPrioritySuggestion, String reasoning) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.symptoms = symptoms;
        this.chiefComplaint = chiefComplaint;
        this.vitals = vitals;
        this.aiPrioritySuggestion = aiPrioritySuggestion;
        this.reasoning = reasoning;
    }

    // Builder Pattern
    public static class Builder {
        private final ExtractionResult result = new ExtractionResult();
        public Builder name(String name) { result.name = name; return this; }
        public Builder age(Integer age) { result.age = age; return this; }
        public Builder gender(String gender) { result.gender = gender; return this; }
        public Builder symptoms(List<String> symptoms) { result.symptoms = symptoms; return this; }
        public Builder chiefComplaint(String complaint) { result.chiefComplaint = complaint; return this; }
        public Builder vitals(Vitals vitals) { result.vitals = vitals; return this; }
        public Builder aiPrioritySuggestion(String suggestion) { result.aiPrioritySuggestion = suggestion; return this; }
        public Builder reasoning(String reasoning) { result.reasoning = reasoning; return this; }
        public ExtractionResult build() { return result; }
    }

    public static Builder builder() { return new Builder(); }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }
    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public Vitals getVitals() { return vitals; }
    public void setVitals(Vitals vitals) { this.vitals = vitals; }
    public String getAiPrioritySuggestion() { return aiPrioritySuggestion; }
    public void setAiPrioritySuggestion(String aiPrioritySuggestion) { this.aiPrioritySuggestion = aiPrioritySuggestion; }
    public String getReasoning() { return reasoning; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }
}
