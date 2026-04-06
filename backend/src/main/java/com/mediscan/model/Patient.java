package com.mediscan.model;

import com.mediscan.model.enums.PatientStatus;
import com.mediscan.model.enums.TriagePriority;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

/**
 * Enterprise-grade Patient entity.
 * Standard Java implementation (No Lombok) for maximum build robustness.
 */
@Document(collection = "patients")
public class Patient {

    @Id
    private String id;
    
    @Indexed
    @NotBlank(message = "Patient name is required")
    private String name;
    
    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 150, message = "Age must be valid")
    private Integer age;
    
    private String gender;
    
    @Indexed(unique = true, sparse = true)
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
    
    private String rawSymptoms;
    private List<String> extractedSymptoms = new ArrayList<>();
    private String chiefComplaint;
    private String description;
    
    private Vitals vitals;
    
    private TriagePriority priority;
    
    private PatientStatus status = PatientStatus.INTAKE;
    
    private String zoneId;
    private String roomId;
    private String assignedDoctorId;
    private String assignedNurseId;
    
    private String location;
    private String assignedStaff;
    
    private Boolean isDeleted = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Standard Constructor
    public Patient() {}

    // Builder Pattern
    public static class PatientBuilder {
        private final Patient patient = new Patient();
        public PatientBuilder id(String id) { patient.id = id; return this; }
        public PatientBuilder name(String name) { patient.name = name; return this; }
        public PatientBuilder age(Integer age) { patient.age = age; return this; }
        public PatientBuilder gender(String gender) { patient.gender = gender; return this; }
        public PatientBuilder email(String email) { patient.email = email; return this; }
        public PatientBuilder phoneNumber(String phoneNumber) { patient.phoneNumber = phoneNumber; return this; }
        public PatientBuilder rawSymptoms(String rawSymptoms) { patient.rawSymptoms = rawSymptoms; return this; }
        public PatientBuilder extractedSymptoms(List<String> symptoms) { patient.extractedSymptoms = symptoms; return this; }
        public PatientBuilder chiefComplaint(String complaint) { patient.chiefComplaint = complaint; return this; }
        public PatientBuilder description(String desc) { patient.description = desc; return this; }
        public PatientBuilder vitals(Vitals vitals) { patient.vitals = vitals; return this; }
        public PatientBuilder priority(TriagePriority priority) { patient.priority = priority; return this; }
        public PatientBuilder status(PatientStatus status) { patient.status = status; return this; }
        public PatientBuilder createdAt(LocalDateTime date) { patient.createdAt = date; return this; }
        public PatientBuilder updatedAt(LocalDateTime date) { patient.updatedAt = date; return this; }
        public Patient build() { return patient; }
    }

    public static PatientBuilder builder() { return new PatientBuilder(); }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getRawSymptoms() { return rawSymptoms; }
    public void setRawSymptoms(String rawSymptoms) { this.rawSymptoms = rawSymptoms; }
    public List<String> getExtractedSymptoms() { return extractedSymptoms; }
    public void setExtractedSymptoms(List<String> extractedSymptoms) { this.extractedSymptoms = extractedSymptoms; }
    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Vitals getVitals() { return vitals; }
    public void setVitals(Vitals vitals) { this.vitals = vitals; }
    public TriagePriority getPriority() { return priority; }
    public void setPriority(TriagePriority priority) { this.priority = priority; }
    public PatientStatus getStatus() { return status; }
    public void setStatus(PatientStatus status) { this.status = status; }
    public String getZoneId() { return zoneId; }
    public void setZoneId(String zoneId) { this.zoneId = zoneId; }
    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public String getAssignedDoctorId() { return assignedDoctorId; }
    public void setAssignedDoctorId(String assignedDoctorId) { this.assignedDoctorId = assignedDoctorId; }
    public String getAssignedNurseId() { return assignedNurseId; }
    public void setAssignedNurseId(String assignedNurseId) { this.assignedNurseId = assignedNurseId; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(String assignedStaff) { this.assignedStaff = assignedStaff; }
    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class Vitals {
        private String bloodPressure;
        private Integer heartRate;
        private Double temperature;
        private Integer oxygenSaturation;
        private String respiratoryRate;

        public Vitals() {}
        public Vitals(String bp, Integer hr, Double temp, Integer oxygen, String resp) {
            this.bloodPressure = bp; this.heartRate = hr; this.temperature = temp; this.oxygenSaturation = oxygen; this.respiratoryRate = resp;
        }

        public static class VitalsBuilder {
            private final Vitals vitals = new Vitals();
            public VitalsBuilder bloodPressure(String bp) { vitals.bloodPressure = bp; return this; }
            public VitalsBuilder heartRate(Integer hr) { vitals.heartRate = hr; return this; }
            public VitalsBuilder temperature(Double temp) { vitals.temperature = temp; return this; }
            public VitalsBuilder oxygenSaturation(Integer os) { vitals.oxygenSaturation = os; return this; }
            public VitalsBuilder respiratoryRate(String rr) { vitals.respiratoryRate = rr; return this; }
            public Vitals build() { return vitals; }
        }

        public static VitalsBuilder builder() { return new VitalsBuilder(); }

        public String getBloodPressure() { return bloodPressure; }
        public void setBloodPressure(String bp) { this.bloodPressure = bp; }
        public Integer getHeartRate() { return heartRate; }
        public void setHeartRate(Integer hr) { this.heartRate = hr; }
        public Double getTemperature() { return temperature; }
        public void setTemperature(Double temp) { this.temperature = temp; }
        public Integer getOxygenSaturation() { return oxygenSaturation; }
        public void setOxygenSaturation(Integer os) { this.oxygenSaturation = os; }
        public String getRespiratoryRate() { return respiratoryRate; }
        public void setRespiratoryRate(String rr) { this.respiratoryRate = rr; }
    }
}
