package com.minishop.service;

import com.minishop.dto.CategoryDto;
import com.minishop.model.Category;
import com.minishop.repository.CategoryRepository;
import com.minishop.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    CategoryRepository categoryRepository;
    @Mock
    ProductRepository productRepository;

    @InjectMocks
    CategoryService categoryService;

    @Test
    void create_Success() {

        CategoryDto.CreateRequest req =
                new CategoryDto.CreateRequest();

        req.setName("Dien Thoai");

        when(categoryRepository.existsByName("Dien Thoai"))
                .thenReturn(false);

        Category category = Category.builder()
                .id(1)
                .name("Dien Thoai")
                .slug("dien-thoai")
                .build();

        when(categoryRepository.save(any()))
                .thenReturn(category);

        when(productRepository.findWithFilters(
                any(),
                any(),
                any()))
                .thenReturn(new PageImpl<>(java.util.List.of()));

        var response = categoryService.create(req);

        assertEquals("dien-thoai",
                response.getSlug());
    }

    @Test
    void create_DuplicateCategory() {

        CategoryDto.CreateRequest req =
                new CategoryDto.CreateRequest();

        req.setName("Laptop");

        when(categoryRepository.existsByName("Laptop"))
                .thenReturn(true);

        RuntimeException ex =
                assertThrows(RuntimeException.class,
                        () -> categoryService.create(req));

        assertEquals("Category already exists",
                ex.getMessage());
    }
}