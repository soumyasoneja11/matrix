package com.mediscan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StructuredSymptoms {
    
    private List<String> symptoms;
    private String severity;
    private String duration;
    private String likely_diagnoses;
    private String recommendations;
    private String emergency_warning_signs;
    
}
