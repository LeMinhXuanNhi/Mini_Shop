package com.minishop.service;

import com.minishop.dto.OrderDto;
import com.minishop.model.*;
import com.minishop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderDto.Response createOrder(OrderDto.CreateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .phoneNumber(request.getPhoneNumber())
                .note(request.getNote())
                .status(Order.OrderStatus.PENDING)
                .build();

        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Not enough stock for: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
        }).collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(i -> i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(total);
        order.setOrderItems(items);

        return toResponse(orderRepository.save(order));
    }

    public List<OrderDto.Response> getMyOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrderDto.Response getById(Long id, String username) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        // Check ownership or admin
        if (!order.getUser().getUsername().equals(username)) {
            User user = userRepository.findByUsername(username).orElseThrow();
            if (user.getRole() != User.Role.ADMIN) {
                throw new RuntimeException("Access denied");
            }
        }
        return toResponse(order);
    }

    public Page<OrderDto.Response> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toResponse);
    }

    @Transactional
    public OrderDto.Response updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        return toResponse(orderRepository.save(order));
    }

    private OrderDto.Response toResponse(Order o) {
        OrderDto.Response resp = new OrderDto.Response();
        resp.setId(o.getId());
        resp.setStatus(o.getStatus().name());
        resp.setTotalAmount(o.getTotalAmount());
        resp.setShippingAddress(o.getShippingAddress());
        resp.setPhoneNumber(o.getPhoneNumber());
        resp.setNote(o.getNote());
        resp.setCreatedAt(o.getCreatedAt() != null ? o.getCreatedAt().toString() : null);
        resp.setUsername(o.getUser().getUsername());

        if (o.getOrderItems() != null) {
            List<OrderDto.OrderItemResponse> itemResps = o.getOrderItems().stream().map(item -> {
                OrderDto.OrderItemResponse ir = new OrderDto.OrderItemResponse();
                ir.setId(item.getId());
                ir.setProductName(item.getProduct().getName());
                ir.setProductImage(item.getProduct().getImageUrl());
                ir.setQuantity(item.getQuantity());
                ir.setUnitPrice(item.getUnitPrice());
                ir.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                return ir;
            }).collect(Collectors.toList());
            resp.setOrderItems(itemResps);
        }

        return resp;
    }
}
