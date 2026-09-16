package com.example.paginationapi.product;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Cacheable(cacheNames = "products", key = "'page=' + #page + ':size=' + #size + ':sort=' + #sort + ':direction=' + #direction")
    public PageResponse<Product> getProducts(int page, int size, String sort, String direction) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(sortDirection, sort).and(Sort.by(Sort.Direction.ASC, "id")));
        Page<Product> products = productRepository.findAll(pageable);
        return PageResponse.from(products, sort + "," + direction);
    }

    @Cacheable(cacheNames = "productById", key = "#id")
    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "products", allEntries = true),
            @CacheEvict(cacheNames = "productById", allEntries = true)
    })
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
}