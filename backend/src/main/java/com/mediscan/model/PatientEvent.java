package com.mediscan.model;

import com.mediscan.model.enums.PatientStatus;
import com.mediscan.model.enums.TriagePriority;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

/**
 * Standard Java PatientEvent (No Lombok).
 */
@Document(collection = "patient_events")
public class PatientEvent {
    
    @Id
    private String id;
    
    @Indexed
    private String patientId;
    
    private String eventType;
    private String description;
    
    private PatientStatus prevStatus;
    private PatientStatus nextStatus;
    private TriagePriority prevPriority;
    private TriagePriority nextPriority;
    
    private String actorId;
    private String actorName;
    
    @CreatedDate
    private LocalDateTime createdAt;

    public PatientEvent() {}

    // Builder Pattern
    public static class Builder {
        private final PatientEvent event = new PatientEvent();
        public Builder id(String id) { event.id = id; return this; }
        public Builder patientId(String patientId) { event.patientId = patientId; return this; }
        public Builder eventType(String type) { event.eventType = type; return this; }
        public Builder description(String desc) { event.description = desc; return this; }
        public Builder prevStatus(PatientStatus status) { event.prevStatus = status; return this; }
        public Builder nextStatus(PatientStatus status) { event.nextStatus = status; return this; }
        public Builder prevPriority(TriagePriority priority) { event.prevPriority = priority; return this; }
        public Builder nextPriority(TriagePriority priority) { event.nextPriority = priority; return this; }
        public Builder actorId(String actorId) { event.actorId = actorId; return this; }
        public Builder actorName(String actorName) { event.actorName = actorName; return this; }
        public Builder createdAt(LocalDateTime date) { event.createdAt = date; return this; }
        public PatientEvent build() { return event; }
    }

    public static Builder builder() { return new Builder(); }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public PatientStatus getPrevStatus() { return prevStatus; }
    public void setPrevStatus(PatientStatus prevStatus) { this.prevStatus = prevStatus; }
    public PatientStatus getNextStatus() { return nextStatus; }
    public void setNextStatus(PatientStatus nextStatus) { this.nextStatus = nextStatus; }
    public TriagePriority getPrevPriority() { return prevPriority; }
    public void setPrevPriority(TriagePriority prevPriority) { this.prevPriority = prevPriority; }
    public TriagePriority getNextPriority() { return nextPriority; }
    public void setNextPriority(TriagePriority nextPriority) { this.nextPriority = nextPriority; }
    public String getActorId() { return actorId; }
    public void setActorId(String actorId) { this.actorId = actorId; }
    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
