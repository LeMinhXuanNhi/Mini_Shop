package com.minishop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minishop.dto.OrderDto;
import com.minishop.security.JwtAuthFilter;
import com.minishop.security.JwtUtil;
import com.minishop.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    @WithMockUser(username = "user")
    void createOrder_Return201() throws Exception {

        OrderDto.OrderItemRequest item = new OrderDto.OrderItemRequest();
        item.setProductId(1L);
        item.setQuantity(2);

        OrderDto.CreateRequest request = new OrderDto.CreateRequest();
        request.setShippingAddress("123 Test Street");
        request.setPhoneNumber("0901234567");
        request.setNote("Test order");
        request.setItems(List.of(item));

        when(orderService.createOrder(any(), eq("user")))
                .thenReturn(new OrderDto.Response());

        mockMvc.perform(post("/api/orders")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(username = "user")
    void getMyOrders_Return200() throws Exception {

        when(orderService.getMyOrders("user"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/orders/my"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user")
    void getById_Return200() throws Exception {

        when(orderService.getById(1L, "user"))
                .thenReturn(new OrderDto.Response());

        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllOrders_Return200() throws Exception {

        when(orderService.getAllOrders(anyInt(), anyInt()))
                .thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/orders/all"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateStatus_Return200() throws Exception {

        OrderDto.UpdateStatusRequest request = new OrderDto.UpdateStatusRequest();

        when(orderService.updateStatus(eq(1L), any()))
                .thenReturn(new OrderDto.Response());

        mockMvc.perform(patch("/api/orders/1/status")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}