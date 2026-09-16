package com.example.postmanager.web;

import java.time.Instant;
import java.util.Map;

public class ApiResponse<T> {
    private boolean success;
    private String error;
    private String message;
    private T data;
    private Map<String, Object> details;
    private String path;
    private String requestId;
    private Instant timestamp;

    public ApiResponse() {
        this.timestamp = Instant.now();
    }

    public ApiResponse(boolean success, String error, String message, T data, Map<String, Object> details,
                       String path, String requestId) {
        this.success = success;
        this.error = error;
        this.message = message;
        this.data = data;
        this.details = details;
        this.path = path;
        this.requestId = requestId;
        this.timestamp = Instant.now();
    }

    public static <T> ApiResponse<T> ok(T data, String path, String requestId) {
        return new ApiResponse<>(true, null, "OK", data, null, path, requestId);
    }

    public static <T> ApiResponse<T> created(T data, String path, String requestId) {
        return new ApiResponse<>(true, null, "Created", data, null, path, requestId);
    }

    public static <T> ApiResponse<T> error(String error, String message, String path, String requestId, Map<String, Object> details) {
        return new ApiResponse<>(false, error, message, null, details, path, requestId);
    }

    public static <T> ApiResponse<T> error(String error, String message, String path, String requestId) {
        return new ApiResponse<>(false, error, message, null, null, path, requestId);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
