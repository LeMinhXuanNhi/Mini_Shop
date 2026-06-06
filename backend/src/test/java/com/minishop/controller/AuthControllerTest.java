package com.minishop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.minishop.dto.AuthDto;
import com.minishop.security.JwtAuthFilter;
import com.minishop.security.JwtUtil;
import com.minishop.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    void register_Return201() throws Exception {

        AuthDto.RegisterRequest request = new AuthDto.RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@gmail.com");
        request.setPassword("123456");
        request.setFullName("Test User");

        when(authService.register(any(AuthDto.RegisterRequest.class)))
                .thenReturn(new AuthDto.AuthResponse(
                        "jwt-token",
                        "testuser",
                        "test@gmail.com",
                        "USER",
                        "Test User"
                ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void login_Return200() throws Exception {

        AuthDto.LoginRequest request = new AuthDto.LoginRequest();
        request.setUsername("testuser");
        request.setPassword("123456");

        when(authService.login(any(AuthDto.LoginRequest.class)))
                .thenReturn(new AuthDto.AuthResponse(
                        "jwt-token",
                        "testuser",
                        "test@gmail.com",
                        "USER",
                        "Test User"
                ));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}