package com.minishop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minishop.dto.ProductDto;
import com.minishop.security.JwtAuthFilter;
import com.minishop.security.JwtUtil;
import com.minishop.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    void getAll_Return200() throws Exception {

        when(productService.getAll(anyInt(), anyInt(), any(), any()))
                .thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }

    @Test
    void getById_Return200() throws Exception {

        when(productService.getById(1L))
                .thenReturn(new ProductDto.Response());

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void create_Return201() throws Exception {

        ProductDto.CreateRequest request = new ProductDto.CreateRequest();

        request.setName("Test Product");
        request.setDescription("Test Description");
        request.setPrice(BigDecimal.valueOf(100000));
        request.setOriginalPrice(BigDecimal.valueOf(120000));
        request.setStockQuantity(10);
        request.setImageUrl("image.jpg");
        request.setCategoryId(1);

        when(productService.create(any(), eq("admin")))
                .thenReturn(new ProductDto.Response());

        mockMvc.perform(post("/api/products")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void update_Return200() throws Exception {

        ProductDto.UpdateRequest request = new ProductDto.UpdateRequest();

        request.setName("Updated Product");
        request.setDescription("Updated Description");
        request.setPrice(BigDecimal.valueOf(200000));
        request.setOriginalPrice(BigDecimal.valueOf(250000));
        request.setStockQuantity(20);
        request.setImageUrl("updated.jpg");
        request.setCategoryId(1);
        request.setIsActive(true);

        when(productService.update(eq(1L), any()))
                .thenReturn(new ProductDto.Response());

        mockMvc.perform(put("/api/products/1")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void delete_Return204() throws Exception {

        doNothing().when(productService).delete(1L);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
    }
}