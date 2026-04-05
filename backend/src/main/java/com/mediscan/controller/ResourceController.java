package com.mediscan.controller;

import com.mediscan.dto.ApiResponse;
import com.mediscan.model.Room;
import com.mediscan.model.Zone;
import com.mediscan.service.ResourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/zones")
    public ResponseEntity<ApiResponse<List<Zone>>> getAllZones() {
        return ResponseEntity.ok(ApiResponse.success(
                resourceService.getAllZones(),
                "Zones retrieved successfully"
        ));
    }

    @GetMapping("/zones/{zoneId}/rooms")
    public ResponseEntity<ApiResponse<List<Room>>> getRoomsByZone(@PathVariable String zoneId) {
        return ResponseEntity.ok(ApiResponse.success(
                resourceService.getRoomsByZone(zoneId),
                "Rooms for zone retrieved successfully"
        ));
    }

    @GetMapping("/rooms/available")
    public ResponseEntity<ApiResponse<List<Room>>> getAvailableRooms() {
        return ResponseEntity.ok(ApiResponse.success(
                resourceService.getAvailableRooms(),
                "Available rooms retrieved successfully"
        ));
    }
}
