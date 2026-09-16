package com.example.postmanager.service;

import com.example.postmanager.dto.PostDTO;
import com.example.postmanager.exception.ResourceNotFoundException;
import com.example.postmanager.model.Post;
import com.example.postmanager.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    private static final Logger log = LoggerFactory.getLogger(PostService.class);
    private final PostRepository repo;

    public PostService(PostRepository repo) {
        this.repo = repo;
    }

    public Post create(PostDTO dto) {
        log.info("Creating post for author={} title={}", dto.getAuthor(), dto.getTitle());
        Post post = new Post(dto.getTitle(), dto.getContent(), dto.getAuthor());
        return repo.save(post);
    }

    public List<Post> listAll() {
        log.debug("Fetching all posts");
        return repo.findAll();
    }

    public Post getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> {
                    log.warn("Post lookup failed for id={}", id);
                    return new ResourceNotFoundException("Post", id);
                });
    }

    public Post update(Long id, PostDTO dto) {
        Post existing = repo.findById(id)
                .orElseThrow(() -> {
                    log.warn("Update failed bc post {} not found", id);
                    return new ResourceNotFoundException("Post", id);
                });

        existing.setTitle(dto.getTitle());
        existing.setContent(dto.getContent());
        existing.setAuthor(dto.getAuthor());

        Post updated = repo.save(existing);
        log.info("Updated post id={}", updated.getId());
        return updated;
    }

    public boolean delete(Long id) {
        if (!repo.existsById(id)) {
            log.warn("Delete rejected for missing post id={}", id);
            return false;
        }
        repo.deleteById(id);
        log.info("Deleted post id={}", id);
        return true;
    }
}
