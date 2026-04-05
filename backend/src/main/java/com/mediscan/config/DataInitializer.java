package com.mediscan.config;

import com.mediscan.model.Room;
import com.mediscan.model.Zone;
import com.mediscan.model.User;
import com.mediscan.model.enums.Role;
import com.mediscan.model.enums.TriagePriority;
import com.mediscan.repository.RoomRepository;
import com.mediscan.repository.UserRepository;
import com.mediscan.repository.ZoneRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final ZoneRepository zoneRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ZoneRepository zoneRepository, 
                           RoomRepository roomRepository, 
                           UserRepository userRepository, 
                           PasswordEncoder passwordEncoder) {
        this.zoneRepository = zoneRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (zoneRepository.count() == 0) {
            log.info("Seeding initial hospital zones and rooms...");
            
            // Seed Zones
            Zone redZone = zoneRepository.save(Zone.builder().name("Resuscitation (Red Zone)").priorityBand(TriagePriority.RED).maxCapacity(5).build());
            Zone orangeZone = zoneRepository.save(Zone.builder().name("Major Trauma (Orange Zone)").priorityBand(TriagePriority.ORANGE).maxCapacity(10).build());
            Zone yellowZone = zoneRepository.save(Zone.builder().name("Urgent Care (Yellow Zone)").priorityBand(TriagePriority.YELLOW).maxCapacity(15).build());
            Zone greenZone = zoneRepository.save(Zone.builder().name("Standard Care (Green Zone)").priorityBand(TriagePriority.GREEN).maxCapacity(20).build());
            
            // Seed Rooms
            roomRepository.save(Room.builder().roomCode("RED-01").zoneId(redZone.getId()).equipment(List.of("Defibrillator", "Ventilator")).build());
            roomRepository.save(Room.builder().roomCode("RED-02").zoneId(redZone.getId()).equipment(List.of("Defibrillator", "Ventilator")).build());
            roomRepository.save(Room.builder().roomCode("OR-01").zoneId(orangeZone.getId()).equipment(List.of("Monitor", "Oxygen")).build());
            roomRepository.save(Room.builder().roomCode("YL-01").zoneId(yellowZone.getId()).equipment(List.of("Monitor")).build());
            roomRepository.save(Room.builder().roomCode("GN-01").zoneId(greenZone.getId()).build());

            log.info("Seeding initial administrative user...");
            if (userRepository.findByUsername("admin").isEmpty()) {
                userRepository.save(User.builder()
                        .username("admin")
                        .fullName("System Administrator")
                        .email("admin@vitalpass.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .active(true)
                        .build());
            }
        }
    }
}
