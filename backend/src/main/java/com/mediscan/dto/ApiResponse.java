package com.mediscan.dto;

import java.time.LocalDateTime;

/**
 * Standard Java DTO for API Response (No Lombok).
 */
public class ApiResponse<T> {
    
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public ApiResponse() {}

    public ApiResponse(boolean success, String message, T data, LocalDateTime timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setMessage(message);
        response.setData(data);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }

    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setMessage(message);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // Manual Builder for compatibility with existing code if needed
    public static class Builder<T> {
        private final ApiResponse<T> response = new ApiResponse<>();
        public Builder<T> success(boolean success) { response.success = success; return this; }
        public Builder<T> message(String message) { response.message = message; return this; }
        public Builder<T> data(T data) { response.data = data; return this; }
        public Builder<T> timestamp(LocalDateTime timestamp) { response.timestamp = timestamp; return this; }
        public ApiResponse<T> build() { return response; }
    }

    public static <T> Builder<T> builder() { return new Builder<>(); }
}
