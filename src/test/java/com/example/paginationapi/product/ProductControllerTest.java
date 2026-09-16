package com.example.paginationapi.product;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void returnsPageMetadataAndSortedContent() throws Exception {
        Product product = new Product("Keyboard", "Tech", BigDecimal.valueOf(49.99));
        when(productService.getProducts(0, 2, "price", "desc"))
            .thenReturn(new PageResponse<>(List.of(product), 0, 2, 5, 3, true, false, "price,desc"));

        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "2")
                        .param("sort", "price")
                        .param("direction", "desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Keyboard"))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(2))
                .andExpect(jsonPath("$.totalElements").value(5))
                .andExpect(jsonPath("$.totalPages").value(3))
                .andExpect(jsonPath("$.sort").value("price,desc"));

    }

    @Test
    void rejectsUnsupportedSortField() throws Exception {
        mockMvc.perform(get("/api/products").param("sort", "unknown"))
                .andExpect(status().isBadRequest());
    }
}
