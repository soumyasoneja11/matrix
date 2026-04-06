package com.mediscan.service;

import com.mediscan.model.Patient;
import com.mediscan.model.Room;
import com.mediscan.model.Zone;
import com.mediscan.model.enums.TriagePriority;
import com.mediscan.repository.RoomRepository;
import com.mediscan.repository.ZoneRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceAllocator {

    private static final Logger log = LoggerFactory.getLogger(ResourceAllocator.class);

    private final ZoneRepository zoneRepository;
    private final RoomRepository roomRepository;

    public ResourceAllocator(ZoneRepository zoneRepository, RoomRepository roomRepository) {
        this.zoneRepository = zoneRepository;
        this.roomRepository = roomRepository;
    }

    public void allocateResource(Patient patient) {
        if (patient == null || patient.getPriority() == null) {
            log.warn("Cannot allocate resources for null patient or null priority.");
            return;
        }

        log.info("Allocating resources for patient: {} with priority: {}", patient.getName(), patient.getPriority());

        // 1. Find the correct Zone for this priority
        List<Zone> zones = zoneRepository.findByPriorityBand(patient.getPriority());
        if (zones.isEmpty()) {
            log.warn("No specific zone found for priority {}.", patient.getPriority());
            return;
        }

        // 2. Find an available room in those zones
        for (Zone zone : zones) {
            List<Room> availableRooms = roomRepository.findByZoneIdAndIsOccupied(zone.getId(), false);
            if (!availableRooms.isEmpty()) {
                Room selectedRoom = availableRooms.get(0);
                
                // 3. Update Patient and Room
                patient.setZoneId(zone.getId());
                patient.setRoomId(selectedRoom.getId());
                
                selectedRoom.setIsOccupied(true);
                selectedRoom.setCurrentPatientId(patient.getId());
                roomRepository.save(selectedRoom);
                
                log.info("Successfully allocated Patient {} to Room {} in Zone {}", 
                        patient.getName(), selectedRoom.getRoomCode(), zone.getName());
                return;
            }
        }

        log.warn("Unable to find an available room for patient: {}. Patient will remain in waiting status.", patient.getName());
    }
}
