package com.example.postmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PostDTO {
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be at most 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    @Size(max = 5000, message = "Content is too long")
    private String content;

    @NotBlank(message = "Author is required")
    @Size(max = 100, message = "Author is too long")
    private String author;

    public PostDTO() {
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
}
