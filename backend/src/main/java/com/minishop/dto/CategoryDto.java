package com.minishop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class CategoryDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Category name is required")
        private String name;
        private String description;
    }

    @Data
    public static class Response {
        private Integer id;
        private String name;
        private String slug;
        private String description;
        private long productCount;
    }
}
