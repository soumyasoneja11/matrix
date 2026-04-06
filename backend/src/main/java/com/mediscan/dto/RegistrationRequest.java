package com.mediscan.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Standard Java DTO for Patient Registration (No Lombok).
 */
public class RegistrationRequest {
    
    @NotBlank(message = "Patient name is required")
    private String name;
    
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private Integer age;

    private String gender;
    
    @NotBlank(message = "Symptoms description is required")
    private String symptoms;

    public RegistrationRequest() {}

    public RegistrationRequest(String name, String email, String phoneNumber, String symptoms, Integer age, String gender) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.symptoms = symptoms;
        this.age = age;
        this.gender = gender;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
}
