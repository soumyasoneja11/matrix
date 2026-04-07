package com.mediscan.service;

import com.mediscan.model.User;
import com.mediscan.model.enums.Role;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.List;

@Service
public class StaffService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllStaff() {
        return userRepository.findAll();
    }

    public User getStaffById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found with id: " + id));
    }

    public User createStaff(User payload) {
        if (payload == null) {
            throw new IllegalArgumentException("Staff payload cannot be null");
        }
        if (payload.getUsername() == null || payload.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (payload.getEmail() == null || payload.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        User user = new User();
        user.setUsername(payload.getUsername().trim());
        user.setEmail(payload.getEmail().trim());
        user.setFullName(payload.getFullName());
        user.setDepartment(payload.getDepartment());
        user.setSpecialization(payload.getSpecialization());
        user.setRole(payload.getRole() != null ? payload.getRole() : Role.NURSE);
        user.setActive(payload.getActive() != null ? payload.getActive() : Boolean.TRUE);
        user.setPassword(passwordEncoder.encode("ChangeMe123!"));

        return userRepository.save(user);
    }

    public User updateStaff(String id, User updatedUser) {
        User user = getStaffById(id);
        if (updatedUser.getFullName() != null && !updatedUser.getFullName().isBlank()) {
            user.setFullName(updatedUser.getFullName().trim());
        }
        if (updatedUser.getRole() != null) user.setRole(updatedUser.getRole());
        if (updatedUser.getDepartment() != null) user.setDepartment(updatedUser.getDepartment());
        if (updatedUser.getSpecialization() != null) user.setSpecialization(updatedUser.getSpecialization());
        return userRepository.save(user);
    }

    public void deleteStaff(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Staff member not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public List<Map<String, Object>> getAssignments() {
        // Assignment subsystem can populate this later. Return contract-safe empty list for now.
        return Collections.emptyList();
    }
}
