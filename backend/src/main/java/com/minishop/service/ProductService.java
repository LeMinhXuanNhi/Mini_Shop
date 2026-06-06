package com.minishop.service;

import com.minishop.dto.CategoryDto;
import com.minishop.dto.ProductDto;
import com.minishop.model.*;
import com.minishop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public Page<ProductDto.Response> getAll(int page, int size, Integer categoryId, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Build specification dynamically to avoid Hibernate lower(bytea) bug
        org.springframework.data.jpa.domain.Specification<com.minishop.model.Product> spec =
            org.springframework.data.jpa.domain.Specification.where(
                (root, query, cb) -> cb.equal(root.get("isActive"), true)
            );

        if (categoryId != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("category").get("id"), categoryId));
        }

        if (keyword != null && !keyword.isBlank()) {
            String pattern = "%" + keyword.toLowerCase() + "%";
            spec = spec.and((root, query, cb) ->
                cb.like(cb.lower(root.get("name")), pattern));
        }

        Page<com.minishop.model.Product> products = productRepository.findAll(spec, pageable);
        return products.map(this::toResponse);
    }


    public ProductDto.Response getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return toResponse(product);
    }

    public ProductDto.Response create(ProductDto.CreateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .createdBy(user)
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        return toResponse(productRepository.save(product));
    }

    public ProductDto.Response update(Long id, ProductDto.UpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getOriginalPrice() != null) product.setOriginalPrice(request.getOriginalPrice());
        if (request.getStockQuantity() != null) product.setStockQuantity(request.getStockQuantity());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        return toResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsActive(false);
        productRepository.save(product);
    }

    private ProductDto.Response toResponse(Product p) {
        ProductDto.Response resp = new ProductDto.Response();
        resp.setId(p.getId());
        resp.setName(p.getName());
        resp.setDescription(p.getDescription());
        resp.setPrice(p.getPrice());
        resp.setOriginalPrice(p.getOriginalPrice());
        resp.setStockQuantity(p.getStockQuantity());
        resp.setImageUrl(p.getImageUrl());
        resp.setIsActive(p.getIsActive());
        resp.setCreatedAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null);
        if (p.getCategory() != null) {
            CategoryDto.Response catResp = new com.minishop.dto.CategoryDto.Response();
            catResp.setId(p.getCategory().getId());
            catResp.setName(p.getCategory().getName());
            catResp.setSlug(p.getCategory().getSlug());
            resp.setCategory(catResp);
        }
        if (p.getCreatedBy() != null) {
            resp.setCreatedByUsername(p.getCreatedBy().getUsername());
        }
        return resp;
    }
}
