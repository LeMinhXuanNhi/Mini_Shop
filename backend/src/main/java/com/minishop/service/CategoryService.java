package com.minishop.service;

import com.minishop.dto.CategoryDto;
import com.minishop.model.Category;
import com.minishop.repository.CategoryRepository;
import com.minishop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public List<CategoryDto.Response> getAll() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryDto.Response create(CategoryDto.CreateRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists");
        }

        String slug = request.getName().toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");

        Category category = Category.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .build();

        return toResponse(categoryRepository.save(category));
    }

    private CategoryDto.Response toResponse(Category c) {
        CategoryDto.Response resp = new CategoryDto.Response();
        resp.setId(c.getId());
        resp.setName(c.getName());
        resp.setSlug(c.getSlug());
        resp.setDescription(c.getDescription());
        long count = productRepository.findWithFilters(c.getId(), null,
                PageRequest.of(0, 1)).getTotalElements();
        resp.setProductCount(count);
        return resp;
    }
}
