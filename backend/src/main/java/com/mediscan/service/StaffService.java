package com.mediscan.service;

import com.mediscan.model.User;
import com.mediscan.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StaffService {
    
    private final UserRepository userRepository;

    public StaffService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllStaff() {
        return userRepository.findAll();
    }

    public User getStaffById(String id) {
        return userRepository.findById(id).orElseThrow();
    }

    public void updateStaff(String id, User updatedUser) {
        User user = userRepository.findById(id).orElseThrow();
        user.setFullName(updatedUser.getFullName());
        user.setRole(updatedUser.getRole());
        user.setDepartment(updatedUser.getDepartment());
        user.setSpecialization(updatedUser.getSpecialization());
        userRepository.save(user);
    }
}
