package com.mediscan.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.List;
import java.util.ArrayList;

/**
 * Standard Java Room Entity (No Lombok).
 */
@Document(collection = "rooms")
public class Room {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String roomCode;
    
    private String zoneId;
    private List<String> equipment = new ArrayList<>();
    
    private Boolean isOccupied = false;
    
    private String currentPatientId;
    
    private Integer capacity = 1;

    public Room() {}

    // Builder Pattern
    public static class Builder {
        private final Room room = new Room();
        public Builder id(String id) { room.id = id; return this; }
        public Builder roomCode(String roomCode) { room.roomCode = roomCode; return this; }
        public Builder zoneId(String zoneId) { room.zoneId = zoneId; return this; }
        public Builder equipment(List<String> equipment) { room.equipment = equipment; return this; }
        public Builder isOccupied(Boolean isOccupied) { room.isOccupied = isOccupied; return this; }
        public Builder currentPatientId(String patientId) { room.currentPatientId = patientId; return this; }
        public Builder capacity(Integer capacity) { room.capacity = capacity; return this; }
        public Room build() { return room; }
    }

    public static Builder builder() { return new Builder(); }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }
    public String getZoneId() { return zoneId; }
    public void setZoneId(String zoneId) { this.zoneId = zoneId; }
    public List<String> getEquipment() { return equipment; }
    public void setEquipment(List<String> equipment) { this.equipment = equipment; }
    public Boolean getIsOccupied() { return isOccupied; }
    public void setIsOccupied(Boolean isOccupied) { this.isOccupied = isOccupied; }
    public String getCurrentPatientId() { return currentPatientId; }
    public void setCurrentPatientId(String currentPatientId) { this.currentPatientId = currentPatientId; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}
