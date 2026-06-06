package com.minishop.service;

import com.minishop.dto.OrderDto;
import com.minishop.model.Order;
import com.minishop.model.Product;
import com.minishop.model.User;
import com.minishop.repository.OrderRepository;
import com.minishop.repository.ProductRepository;
import com.minishop.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    OrderRepository orderRepository;
    @Mock
    UserRepository userRepository;
    @Mock ProductRepository productRepository;

    @InjectMocks
    OrderService orderService;

    @Test
    void createOrder_UserNotFound() {

        when(userRepository.findByUsername("nhi"))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(RuntimeException.class,
                        () -> orderService.createOrder(
                                new OrderDto.CreateRequest(),
                                "nhi"));

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void createOrder_ProductNotFound() {

        User user = User.builder()
                .username("nhi")
                .build();

        when(userRepository.findByUsername("nhi"))
                .thenReturn(Optional.of(user));

        OrderDto.OrderItemRequest item =
                new OrderDto.OrderItemRequest();

        item.setProductId(1L);
        item.setQuantity(1);

        OrderDto.CreateRequest req =
                new OrderDto.CreateRequest();

        req.setItems(List.of(item));

        when(productRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(RuntimeException.class,
                        () -> orderService.createOrder(req,"nhi"));

        assertTrue(ex.getMessage()
                .contains("Product not found"));
    }

    @Test
    void createOrder_NotEnoughStock() {

        User user = User.builder()
                .username("nhi")
                .build();

        Product product = Product.builder()
                .id(1L)
                .name("Laptop")
                .stockQuantity(1)
                .price(BigDecimal.valueOf(100))
                .build();

        when(userRepository.findByUsername("nhi"))
                .thenReturn(Optional.of(user));

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        OrderDto.OrderItemRequest item =
                new OrderDto.OrderItemRequest();

        item.setProductId(1L);
        item.setQuantity(10);

        OrderDto.CreateRequest req =
                new OrderDto.CreateRequest();

        req.setItems(List.of(item));

        RuntimeException ex =
                assertThrows(RuntimeException.class,
                        () -> orderService.createOrder(req,"nhi"));

        assertTrue(ex.getMessage()
                .contains("Not enough stock"));
    }

    @Test
    void getById_AccessDenied() {

        User owner = User.builder()
                .username("owner")
                .build();

        Order order = Order.builder()
                .user(owner)
                .build();

        when(orderRepository.findById(1L))
                .thenReturn(Optional.of(order));

        User otherUser = User.builder()
                .username("other")
                .role(User.Role.USER)
                .build();

        when(userRepository.findByUsername("other"))
                .thenReturn(Optional.of(otherUser));

        RuntimeException ex =
                assertThrows(RuntimeException.class,
                        () -> orderService.getById(1L,"other"));

        assertEquals("Access denied", ex.getMessage());
    }
}