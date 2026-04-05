package com.mediscan.repository;

import com.mediscan.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    
    Optional<Room> findByRoomCode(String roomCode);
    List<Room> findByZoneId(String zoneId);
    List<Room> findByIsOccupied(Boolean isOccupied);
    List<Room> findByZoneIdAndIsOccupied(String zoneId, Boolean isOccupied);
}
