package com.mediscan.model.enums;

public enum Role {
    ADMIN("Administrator", "Full system access"),
    DOCTOR("Medical Doctor", "Triage review and patient treatment"),
    NURSE("Triage Nurse", "Intake and initial assessment"),
    RECEPTIONIST("Receptionist", "Patient registration only"),
    PATIENT("Patient", "Portal access to own records and history");

    private final String label;
    private final String description;

    Role(String label, String description) {
        this.label = label;
        this.description = description;
    }

    public String getLabel() { return label; }
    public String getDescription() { return description; }
}
