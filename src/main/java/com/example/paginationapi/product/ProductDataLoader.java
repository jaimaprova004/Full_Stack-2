package com.example.paginationapi.product;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.stream.IntStream;

@Configuration
public class ProductDataLoader {

    @Bean
    CommandLineRunner loadProducts(ProductRepository repository) {
        return args -> IntStream.rangeClosed(1, 30)
                .mapToObj(number -> new Product(
                        "Product " + number,
                        number % 3 == 0 ? "Office" : number % 2 == 0 ? "Home" : "Tech",
                        BigDecimal.valueOf(9.99 + number * 3.5).setScale(2, java.math.RoundingMode.HALF_UP)))
                .forEach(repository::save);
    }
}
