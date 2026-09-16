package com.example.paginationapi.product;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProductServiceTest {

    @Test
    void repeatedPageReadUsesCache() {
        ProductRepository repository = org.mockito.Mockito.mock(ProductRepository.class);
        ProductService target = new ProductService(repository);
        Product product = new Product("Keyboard", "Tech", BigDecimal.valueOf(49.99));
        when(repository.findAll(any(PageRequest.class)))
                .thenReturn(new PageImpl<>(List.of(product), PageRequest.of(0, 2), 1));

        try (AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext()) {
            context.registerBean(ProductRepository.class, () -> repository);
            context.registerBean(ProductService.class, () -> target);
            context.register(CacheTestConfiguration.class);
            context.refresh();

            ProductService cachedService = context.getBean(ProductService.class);
            cachedService.getProducts(0, 2, "id", "asc");
            cachedService.getProducts(0, 2, "id", "asc");

            verify(repository, times(1)).findAll(any(PageRequest.class));
        }
    }

    @Configuration
    @EnableCaching
    static class CacheTestConfiguration {
        @Bean
        CacheManager cacheManager() {
            return new org.springframework.cache.concurrent.ConcurrentMapCacheManager("products", "productById");
        }
    }
}