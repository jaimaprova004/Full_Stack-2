package com.example.studentmanagement.exception;

public class DuplicateStudentException extends RuntimeException {
    public DuplicateStudentException(String message) {
        super(message);
    }

    public DuplicateStudentException(String field, String value) {
        super("Student with " + field + " '" + value + "' already exists");
    }
}
