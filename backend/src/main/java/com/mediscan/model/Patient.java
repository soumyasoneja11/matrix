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
    private String email;
    private String phoneNumber;
    private String symptoms;
    private LocalDateTime registrationDate;
    private LocalDateTime lastUpdated;
    
}
