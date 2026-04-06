package com.mediscan.model;

import com.mediscan.model.enums.TriagePriority;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

/**
 * Standard Java Zone Entity (No Lombok).
 */
@Document(collection = "zones")
public class Zone {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String name;
    
    private TriagePriority priorityBand;
    private String description;
    
    private Integer maxCapacity = 20;
    
    private Integer currentOccupancy = 0;

    public Zone() {}

    // Builder Pattern
    public static class Builder {
        private final Zone zone = new Zone();
        public Builder id(String id) { zone.id = id; return this; }
        public Builder name(String name) { zone.name = name; return this; }
        public Builder priorityBand(TriagePriority band) { zone.priorityBand = band; return this; }
        public Builder description(String desc) { zone.description = desc; return this; }
        public Builder maxCapacity(Integer max) { zone.maxCapacity = max; return this; }
        public Builder currentOccupancy(Integer occupancy) { zone.currentOccupancy = occupancy; return this; }
        public Zone build() { return zone; }
    }

    public static Builder builder() { return new Builder(); }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public TriagePriority getPriorityBand() { return priorityBand; }
    public void setPriorityBand(TriagePriority priorityBand) { this.priorityBand = priorityBand; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }
    public Integer getCurrentOccupancy() { return currentOccupancy; }
    public void setCurrentOccupancy(Integer currentOccupancy) { this.currentOccupancy = currentOccupancy; }
}
