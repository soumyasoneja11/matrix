package com.mediscan.repository;

import com.mediscan.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
import com.mediscan.model.enums.Role;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findBySpecialization(String specialization);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
