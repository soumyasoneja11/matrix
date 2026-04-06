package com.mediscan.service;

import com.mediscan.model.Patient;
import com.mediscan.repository.PatientRepository;
import com.mediscan.dto.RegistrationRequest;
import com.mediscan.dto.TriageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PatientService {

    private static final Pattern PATIENT_NAME_PATTERN =
        Pattern.compile("(?:patient|name)[:\\s]+([A-Za-z]+(?:\\s[A-Za-z]+)?)", Pattern.CASE_INSENSITIVE);
    private static final Pattern TITLE_NAME_PATTERN =
        Pattern.compile("(?:Mr\\.|Mrs\\.|Ms\\.)\\s+([A-Za-z]+(?:\\s[A-Za-z]+)?)", Pattern.CASE_INSENSITIVE);
    private static final Pattern AGE_WORD_PATTERN =
        Pattern.compile("(\\d{1,3})\\s*(?:year|yr|y/o|yo|years)\\s*(?:old)?");
    @Autowired
    private PatientRepository patientRepository;
    
    public Patient registerPatient(RegistrationRequest request) {
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setEmail(request.getEmail());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setSymptoms(request.getSymptoms());
        patient.setRegistrationDate(LocalDateTime.now());
        patient.setLastUpdated(LocalDateTime.now());
        
        return patientRepository.save(patient);
    }
    
    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }
    
    public Optional<Patient> getPatientByEmail(String email) {
        return patientRepository.findByEmail(email);
    }
    
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    
    public Patient updatePatient(String id, RegistrationRequest request) {
        Optional<Patient> existingPatient = patientRepository.findById(id);
        if (existingPatient.isPresent()) {
            Patient patient = existingPatient.get();
            patient.setName(request.getName());
            patient.setEmail(request.getEmail());
            patient.setPhoneNumber(request.getPhoneNumber());
            patient.setSymptoms(request.getSymptoms());
            patient.setLastUpdated(LocalDateTime.now());
            return patientRepository.save(patient);
        }
        return null;
    }
    
    public boolean deletePatient(String id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Patient triagePatient(TriageRequest request) {
        String details = request.getPatientDetails();
        String lower = details == null ? "" : details.toLowerCase(Locale.ROOT);

        Patient patient = new Patient();
        patient.setSymptoms(details);
        patient.setChiefComplaint(extractChiefComplaint(lower));
        patient.setName(extractName(details));
        patient.setAge(extractAge(lower));
        patient.setGender(extractGender(lower));
        patient.setTriageLevel(determineTriageLevel(lower));
        patient.setStatus("WAITING");
        LocalDateTime now = LocalDateTime.now();
        patient.setCreatedAt(now);
        patient.setUpdatedAt(now);
        patient.setRegistrationDate(now);
        patient.setLastUpdated(now);

        return patientRepository.save(patient);
    }

    private String extractChiefComplaint(String lower) {
        String[] complaintKeywords = {
            "chest pain", "shortness of breath", "difficulty breathing", "abdominal pain",
            "headache", "back pain", "fever", "vomiting", "dizziness", "seizure",
            "bleeding", "laceration", "fracture", "burn", "rash", "syncope", "fainting",
            "stroke", "trauma", "fall", "allergic reaction", "overdose", "poisoning"
        };
        for (String kw : complaintKeywords) {
            if (!kw.isEmpty() && lower.contains(kw)) {
                return Character.toUpperCase(kw.charAt(0)) + kw.substring(1);
            }
        }
        // Fallback: first sentence/clause
        String[] sentences = lower.split("[.;,!?]");
        if (sentences.length > 0) {
            String first = sentences[0].trim();
            if (!first.isEmpty()) {
                return Character.toUpperCase(first.charAt(0)) + first.substring(1);
            }
        }
        return "Chief complaint not specified";
    }

    private String extractName(String details) {
        if (details == null) return "Unknown Patient";
        Matcher m = PATIENT_NAME_PATTERN.matcher(details);
        if (m.find()) return m.group(1).trim();
        m = TITLE_NAME_PATTERN.matcher(details);
        if (m.find()) return m.group(0).trim();
        return "Unknown Patient";
    }

    private Integer extractAge(String lower) {
        Matcher m = AGE_WORD_PATTERN.matcher(lower);
        if (m.find()) {
            try { return Integer.parseInt(m.group(1)); } catch (NumberFormatException ignored) {}
        }
        m = AGE_LABEL_PATTERN.matcher(lower);
        if (m.find()) {
            try { return Integer.parseInt(m.group(1)); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    private String extractGender(String lower) {
        if (lower.contains(" male") || lower.contains("man ") || lower.contains("boy ")
                || lower.contains(" him") || lower.contains(" he ") || lower.contains("mr.")) {
            return "Male";
        }
        if (lower.contains("female") || lower.contains("woman") || lower.contains("girl ")
                || lower.contains(" her ") || lower.contains(" she ") || lower.contains("ms.")
                || lower.contains("mrs.")) {
            return "Female";
        }
        return null;
    }

    private String determineTriageLevel(String lower) {
        // CRITICAL — life-threatening
        String[] criticalKeywords = {
            "cardiac arrest", "not breathing", "stopped breathing", "no pulse",
            "unconscious", "unresponsive", "massive bleeding", "severe hemorrhage",
            "stroke", "anaphylaxis", "anaphylactic", "airway obstruction", "choking",
            "severe trauma", "gunshot", "stab", "multi-vehicle", "code blue",
            "respiratory failure", "heart attack", "myocardial infarction", "septic shock"
        };
        for (String kw : criticalKeywords) {
            if (lower.contains(kw)) return "CRITICAL";
        }

        // URGENT — potentially serious
        String[] urgentKeywords = {
            "chest pain", "shortness of breath", "difficulty breathing",
            "high fever", "severe pain", "moderate bleeding", "fracture",
            "head injury", "altered mental", "confusion", "severe vomiting",
            "severe headache", "seizure", "suspected fracture", "burns",
            "severe allergic", "abdominal pain", "back pain radiating",
            "blood pressure", "low blood pressure", "hypertensive",
            "dislocated", "deep laceration", "suicidal", "overdose", "poisoning"
        };
        for (String kw : urgentKeywords) {
            if (lower.contains(kw)) return "URGENT";
        }

        return "STANDARD";
    }

}
