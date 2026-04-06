package com.mediscan.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Document(collection = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    private String id;

    private String name;
    private Integer age;
    private String gender;
    private String email;
    private String phoneNumber;
    private String chiefComplaint;
    private String symptoms;
    private String vitalSigns;
    private Integer painLevel;
    private String triageLevel;
    private String status;
    private String zoneName;
    private String roomCode;
    private String assignedNurse;
    private String assignedDoctor;
    private LocalDateTime registrationDate;
    private LocalDateTime lastUpdated;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
