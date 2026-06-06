package com.minishop.service;

import com.minishop.dto.AuthDto;
import com.minishop.model.User;
import com.minishop.repository.UserRepository;
import com.minishop.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock AuthenticationManager authenticationManager;
    @Mock JwtUtil jwtUtil;
    @Mock UserDetailsService userDetailsService;

    @InjectMocks
    AuthService authService;

    @Test
    void register_Success() {
        AuthDto.RegisterRequest req = new AuthDto.RegisterRequest();
        req.setUsername("nhi");
        req.setEmail("nhi@gmail.com");
        req.setPassword("123");

        when(userRepository.existsByUsername("nhi")).thenReturn(false);
        when(userRepository.existsByEmail("nhi@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("123")).thenReturn("encoded");

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("nhi"))
                .thenReturn(userDetails);

        when(jwtUtil.generateToken(userDetails))
                .thenReturn("jwt-token");

        AuthDto.AuthResponse response = authService.register(req);

        assertEquals("jwt-token", response.getToken());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_UsernameAlreadyExists() {
        AuthDto.RegisterRequest req = new AuthDto.RegisterRequest();
        req.setUsername("nhi");

        when(userRepository.existsByUsername("nhi"))
                .thenReturn(true);

        RuntimeException ex =
                assertThrows(RuntimeException.class,
                        () -> authService.register(req));

        assertEquals("Username already taken", ex.getMessage());
    }

    @Test
    void login_Success() {
        AuthDto.LoginRequest req = new AuthDto.LoginRequest();
        req.setUsername("nhi");
        req.setPassword("123");

        User user = User.builder()
                .username("nhi")
                .email("nhi@gmail.com")
                .role(User.Role.USER)
                .build();

        when(userRepository.findByUsername("nhi"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("nhi"))
                .thenReturn(userDetails);

        when(jwtUtil.generateToken(userDetails))
                .thenReturn("jwt-token");

        AuthDto.AuthResponse response = authService.login(req);

        assertEquals("jwt-token", response.getToken());
        assertEquals("nhi", response.getUsername());

        verify(authenticationManager)
                .authenticate(any());
    }
}