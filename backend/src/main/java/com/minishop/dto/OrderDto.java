package com.minishop.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

public class OrderDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Shipping address is required")
        private String shippingAddress;

        @NotBlank(message = "Phone number is required")
        private String phoneNumber;

        private String note;

        @NotNull @Size(min = 1)
        private List<OrderItemRequest> items;
    }

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @NotNull @Min(1)
        private Integer quantity;
    }

    @Data
    public static class UpdateStatusRequest {
        @NotNull
        private String status;
    }

    @Data
    public static class Response {
        private Long id;
        private String status;
        private BigDecimal totalAmount;
        private String shippingAddress;
        private String phoneNumber;
        private String note;
        private String createdAt;
        private String username;
        private List<OrderItemResponse> orderItems;
    }

    @Data
    public static class OrderItemResponse {
        private Long id;
        private String productName;
        private String productImage;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }
}
