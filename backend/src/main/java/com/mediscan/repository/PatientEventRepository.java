package com.mediscan.repository;

import com.mediscan.model.PatientEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatientEventRepository extends MongoRepository<PatientEvent, String> {
    
    List<PatientEvent> findByPatientIdOrderByTimestampDesc(String patientId);
    List<PatientEvent> findByEventType(String eventType);
}
