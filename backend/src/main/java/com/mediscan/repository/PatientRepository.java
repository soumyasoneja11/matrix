package com.mediscan.repository;

import com.mediscan.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {
    
    Optional<Patient> findByEmail(String email);
    List<Patient> findByName(String name);
    List<Patient> findByIsDeletedFalse();
    List<Patient> findByIsDeletedTrue();
}
