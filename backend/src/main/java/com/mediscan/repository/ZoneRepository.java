package com.mediscan.repository;

import com.mediscan.model.Zone;
import com.mediscan.model.enums.TriagePriority;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ZoneRepository extends MongoRepository<Zone, String> {
    
    Optional<Zone> findByName(String name);
    List<Zone> findByPriorityBand(TriagePriority priorityBand);
}
