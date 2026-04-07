package com.mediscan.model;

import com.mediscan.model.enums.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Set;
import java.util.HashSet;

/**
 * Standard Java User Entity (No Lombok).
 */
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    @JsonIgnore
    private String password;
    
    @Indexed(unique = true)
    private String email;
    
    private String fullName;
    private Role role;
    private String department;
    private String specialization;
    
    private Set<String> permissions = new HashSet<>();

    /** Optional link to patients.id when account is a patient portal user */
    private String linkedPatientId;
    
    private Boolean active = true;

    public User() {}

    // Builder Pattern
    public static class Builder {
        private final User user = new User();
        public Builder id(String id) { user.id = id; return this; }
        public Builder username(String username) { user.username = username; return this; }
        public Builder password(String password) { user.password = password; return this; }
        public Builder email(String email) { user.email = email; return this; }
        public Builder fullName(String fullName) { user.fullName = fullName; return this; }
        public Builder role(Role role) { user.role = role; return this; }
        public Builder department(String dept) { user.department = dept; return this; }
        public Builder specialization(String spec) { user.specialization = spec; return this; }
        public Builder permissions(Set<String> perms) { user.permissions = perms; return this; }
        public Builder active(Boolean active) { user.active = active; return this; }
        public Builder linkedPatientId(String linkedPatientId) { user.linkedPatientId = linkedPatientId; return this; }
        public User build() { return user; }
    }

    public static Builder builder() { return new Builder(); }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public Set<String> getPermissions() { return permissions; }
    public void setPermissions(Set<String> permissions) { this.permissions = permissions; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public String getLinkedPatientId() { return linkedPatientId; }
    public void setLinkedPatientId(String linkedPatientId) { this.linkedPatientId = linkedPatientId; }
}
