package com.minishop.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

public class ProductDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Product name is required")
        @Size(max = 200)
        private String name;

        private String description;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false)
        private BigDecimal price;

        private BigDecimal originalPrice;

        @NotNull(message = "Stock quantity is required")
        @Min(value = 0)
        private Integer stockQuantity;

        private String imageUrl;

        private Integer categoryId;
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private String description;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer stockQuantity;
        private String imageUrl;
        private Integer categoryId;
        private Boolean isActive;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer stockQuantity;
        private String imageUrl;
        private Boolean isActive;
        private String createdAt;
        private CategoryDto.Response category;
        private String createdByUsername;
    }
}
