package com.minishop.security;

import com.minishop.model.User;
import com.minishop.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl service;

    @Test
    void loadUserByUsername_Success() {

        User user = new User();
        user.setUsername("user");
        user.setPasswordHash("encoded-password");
        user.setRole(User.Role.USER);

        when(userRepository.findByUsername("user"))
                .thenReturn(Optional.of(user));

        var result = service.loadUserByUsername("user");

        assertEquals("user", result.getUsername());
        assertEquals("encoded-password", result.getPassword());
    }

    @Test
    void loadUserByUsername_NotFound() {

        when(userRepository.findByUsername("abc"))
                .thenReturn(Optional.empty());

        assertThrows(
                UsernameNotFoundException.class,
                () -> service.loadUserByUsername("abc"));
    }
}