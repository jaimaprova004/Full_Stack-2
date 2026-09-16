package com.example.studentmanagement.exception;

public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(String message) {
        super(message);
    }

    public StudentNotFoundException(Long id) {
        super("Student with ID " + id + " not found");
    }

    public StudentNotFoundException(String field, String value) {
        super("Student with " + field + " '" + value + "' not found");
    }
}
