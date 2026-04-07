package com.mediscan.service;

import com.mediscan.model.Room;
import com.mediscan.model.Zone;
import com.mediscan.model.enums.TriagePriority;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.repository.RoomRepository;
import com.mediscan.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceService {
    
    private final ZoneRepository zoneRepository;
    private final RoomRepository roomRepository;

    public ResourceService(ZoneRepository zoneRepository, RoomRepository roomRepository) {
        this.zoneRepository = zoneRepository;
        this.roomRepository = roomRepository;
    }

    public List<Zone> getAllZones() {
        return zoneRepository.findAll();
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getRoomsByZone(String zoneId) {
        return roomRepository.findByZoneId(zoneId);
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByIsOccupied(false);
    }

    public Zone createZone(Zone payload) {
        Zone zone = new Zone();
        zone.setName(payload.getName());
        zone.setDescription(payload.getDescription());
        zone.setPriorityBand(payload.getPriorityBand() != null ? payload.getPriorityBand() : TriagePriority.GREEN);
        zone.setMaxCapacity(payload.getMaxCapacity() != null ? payload.getMaxCapacity() : 20);
        zone.setCurrentOccupancy(0);
        return zoneRepository.save(zone);
    }

    public Room createRoom(Room payload) {
        if (payload.getZoneId() == null || payload.getZoneId().isBlank()) {
            throw new IllegalArgumentException("zoneId is required");
        }
        Zone zone = zoneRepository.findById(payload.getZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Zone not found with id: " + payload.getZoneId()));

        Room room = new Room();
        room.setRoomCode(payload.getRoomCode());
        room.setZoneId(zone.getId());
        room.setCapacity(payload.getCapacity() != null ? payload.getCapacity() : 1);
        room.setEquipment(payload.getEquipment() != null ? payload.getEquipment() : List.of());
        room.setIsOccupied(Boolean.FALSE);
        room.setCurrentPatientId(null);
        return roomRepository.save(room);
    }
}
