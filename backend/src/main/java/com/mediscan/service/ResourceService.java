package com.mediscan.service;

import com.mediscan.model.Room;
import com.mediscan.model.Zone;
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

    public List<Room> getRoomsByZone(String zoneId) {
        return roomRepository.findByZoneId(zoneId);
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByIsOccupied(false);
    }
}
