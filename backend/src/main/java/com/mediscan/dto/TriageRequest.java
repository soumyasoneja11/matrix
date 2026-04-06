package com.mediscan.dto;

import jakarta.validation.constraints.NotBlank;
public class TriageRequest {

    @NotBlank(message = "Patient details are required")
    private String patientDetails;
    private String language;

    public TriageRequest() {
    }

    public TriageRequest(String patientDetails, String language) {
        this.patientDetails = patientDetails;
        this.language = language;
    }

    public String getPatientDetails() {
        return patientDetails;
    }

    public void setPatientDetails(String patientDetails) {
        this.patientDetails = patientDetails;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

}
