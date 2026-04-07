package com.mediscan.service;

import com.mediscan.dto.auth.AuthRequest;
import com.mediscan.dto.auth.AuthResponse;
import com.mediscan.dto.auth.RegisterRequest;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.model.Patient;
import com.mediscan.model.User;
import com.mediscan.model.enums.Role;
import com.mediscan.repository.PatientRepository;
import com.mediscan.repository.UserRepository;
import com.mediscan.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository repository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository repository,
                       PatientRepository patientRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (repository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already in use");
        }
        String emailNorm = normalizeEmail(request.getEmail());
        String checkEmail = emailNorm != null ? emailNorm : request.getEmail();
        if (checkEmail != null && repository.existsByEmail(checkEmail)) {
            throw new IllegalArgumentException("Email is already in use");
        }

        Role role = parseRole(request.getRole());
        String department = request.getDepartment();
        if (department == null || department.isBlank()) {
            department = role == Role.PATIENT ? "PATIENT_PORTAL" : "GENERAL_MEDICINE";
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(emailNorm != null ? emailNorm : request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .department(department)
                .specialization(request.getSpecialization())
                .active(true)
                .build();

        if (role == Role.PATIENT && emailNorm != null) {
            patientRepository.findByEmail(emailNorm).map(Patient::getId).ifPresent(user::setLinkedPatientId);
        }

        User savedUser = repository.save(user);

        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getUsername())
                .password(savedUser.getPassword())
                .authorities("ROLE_" + savedUser.getRole().name())
                .build();

        var jwtToken = jwtService.generateToken(userDetails);

        return toAuthResponse(savedUser, jwtToken);
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        
        User user = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for username: " + request.getUsername()));

        if (user.getRole() == Role.PATIENT && user.getEmail() != null) {
            String em = normalizeEmail(user.getEmail());
            patientRepository.findByEmail(em).ifPresent(p -> {
                if (user.getLinkedPatientId() == null || !user.getLinkedPatientId().equals(p.getId())) {
                    user.setLinkedPatientId(p.getId());
                    repository.save(user);
                }
            });
        }

        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .build();

        var jwtToken = jwtService.generateToken(userDetails);

        return toAuthResponse(user, jwtToken);
    }

    private AuthResponse toAuthResponse(User user, String jwtToken) {
        return AuthResponse.builder()
                .id(user.getId())
                .token(jwtToken)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .department(user.getDepartment())
                .email(user.getEmail())
                .linkedPatientId(user.getLinkedPatientId())
                .build();
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        String t = email.trim();
        return t.isEmpty() ? null : t.toLowerCase(Locale.ROOT);
    }

    private Role parseRole(String roleValue) {
        if (roleValue == null || roleValue.isBlank()) {
            return Role.NURSE;
        }
        try {
            return Role.valueOf(roleValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return Role.NURSE;
        }
    }
}
