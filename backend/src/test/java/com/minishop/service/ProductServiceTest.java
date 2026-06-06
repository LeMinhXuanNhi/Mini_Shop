package com.minishop.service;

import com.minishop.dto.ProductDto;
import com.minishop.model.Product;
import com.minishop.model.User;
import com.minishop.repository.CategoryRepository;
import com.minishop.repository.ProductRepository;
import com.minishop.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock ProductRepository productRepository;
    @Mock CategoryRepository categoryRepository;
    @Mock UserRepository userRepository;

    @InjectMocks
    ProductService productService;

    @Test
    void getById_Success() {

        Product product = Product.builder()
                .id(1L)
                .name("Iphone")
                .build();

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        ProductDto.Response response =
                productService.getById(1L);

        assertEquals("Iphone", response.getName());
    }

    @Test
    void getById_NotFound() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(RuntimeException.class,
                        () -> productService.getById(1L));

        assertEquals("Product not found", ex.getMessage());
    }

    @Test
    void delete_SoftDelete() {

        Product product = Product.builder()
                .id(1L)
                .isActive(true)
                .build();

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        productService.delete(1L);

        assertFalse(product.getIsActive());

        verify(productRepository).save(product);
    }

    @Test
    void create_CategoryNotFound() {

        ProductDto.CreateRequest req =
                new ProductDto.CreateRequest();

        req.setCategoryId(1);

        User user = User.builder()
                .username("admin")
                .build();

        when(userRepository.findByUsername("admin"))
                .thenReturn(Optional.of(user));

        when(categoryRepository.findById(1))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(RuntimeException.class,
                        () -> productService.create(req,"admin"));

        assertEquals("Category not found", ex.getMessage());
    }
}