package com.example.postmanager.web;

import com.example.postmanager.dto.PostDTO;
import com.example.postmanager.model.Post;
import com.example.postmanager.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    private static final Logger log = LoggerFactory.getLogger(PostController.class);
    private final PostService service;

    public PostController(PostService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<ApiResponse<Post>> create(@Valid @RequestBody PostDTO dto, HttpServletRequest request) {
        Post created = service.create(dto);
        log.info("Post created successfully id={}", created.getId());
        return ResponseEntity.status(201).body(ApiResponse.created(created, request.getRequestURI(), request.getHeader("X-Request-Id")));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Post>>> list(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(service.listAll(), request.getRequestURI(), request.getHeader("X-Request-Id")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> get(@PathVariable Long id, HttpServletRequest request) {
        Post p = service.getById(id);
        return ResponseEntity.ok(ApiResponse.ok(p, request.getRequestURI(), request.getHeader("X-Request-Id")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> update(@PathVariable Long id, @Valid @RequestBody PostDTO dto, HttpServletRequest request) {
        Post updated = service.update(id, dto);
        return ResponseEntity.ok(ApiResponse.ok(updated, request.getRequestURI(), request.getHeader("X-Request-Id")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id, HttpServletRequest request) {
        if (!service.delete(id)) {
            throw new IllegalArgumentException("Post with id " + id + " was not found");
        }
        return ResponseEntity.ok(ApiResponse.ok(null, request.getRequestURI(), request.getHeader("X-Request-Id")));
    }
}
