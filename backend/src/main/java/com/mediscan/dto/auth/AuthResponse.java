package com.mediscan.dto.auth;

/**
 * Standard Java DTO for Authentication Response (No Lombok).
 */
public class AuthResponse {
    private String id;
    private String token;
    private String username;
    private String role;
    private String fullName;
    private String email;
    private String department;
    private String linkedPatientId;

    public AuthResponse() {}

    public static class Builder {
        private final AuthResponse response = new AuthResponse();
        
        public Builder id(String id) { response.id = id; return this; }
        public Builder token(String token) { response.token = token; return this; }
        public Builder username(String username) { response.username = username; return this; }
        public Builder role(String role) { response.role = role; return this; }
        public Builder fullName(String fullName) { response.fullName = fullName; return this; }
        public Builder email(String email) { response.email = email; return this; }
        public Builder department(String department) { response.department = department; return this; }
        public Builder linkedPatientId(String linkedPatientId) { response.linkedPatientId = linkedPatientId; return this; }
        
        public AuthResponse build() { return response; }
    }

    public static Builder builder() { return new Builder(); }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getLinkedPatientId() { return linkedPatientId; }
    public void setLinkedPatientId(String linkedPatientId) { this.linkedPatientId = linkedPatientId; }
}
