package com.mediscan.controller;

import com.mediscan.dto.ApiResponse;
import com.mediscan.model.User;
import com.mediscan.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllStaff() {
        return ResponseEntity.ok(ApiResponse.success(
                staffService.getAllStaff(),
                "Staff directory retrieved successfully"
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getStaffById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
                staffService.getStaffById(id),
                "Staff member retrieved successfully"
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateStaff(@PathVariable String id, @RequestBody User user) {
        staffService.updateStaff(id, user);
        return ResponseEntity.ok(ApiResponse.success(null, "Staff member updated successfully"));
    }
}
