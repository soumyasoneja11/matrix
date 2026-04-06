package com.mediscan.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TriageRequest {

    @NotBlank(message = "Patient details are required")
    private String patientDetails;
    private String language;

}
