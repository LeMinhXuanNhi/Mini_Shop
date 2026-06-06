package com.minishop.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {

        jwtUtil = new JwtUtil();

        ReflectionTestUtils.setField(
                jwtUtil,
                "secret",
                "mySecretKeyForJwtTokenMustBeAtLeast32CharactersLong"
        );

        ReflectionTestUtils.setField(
                jwtUtil,
                "expiration",
                3600000L
        );
    }

    @Test
    void generateToken_Success() {

        UserDetails userDetails =
                User.withUsername("user")
                        .password("password")
                        .authorities("USER")
                        .build();

        String token = jwtUtil.generateToken(userDetails);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void extractUsername_Success() {

        UserDetails userDetails =
                User.withUsername("user")
                        .password("password")
                        .authorities("USER")
                        .build();

        String token = jwtUtil.generateToken(userDetails);

        String username = jwtUtil.extractUsername(token);

        assertEquals("user", username);
    }

    @Test
    void validateToken_Success() {

        UserDetails userDetails =
                User.withUsername("user")
                        .password("password")
                        .authorities("USER")
                        .build();

        String token = jwtUtil.generateToken(userDetails);

        assertTrue(jwtUtil.validateToken(token, userDetails));
    }

    @Test
    void validateToken_WrongUsername() {

        UserDetails user =
                User.withUsername("user")
                        .password("password")
                        .authorities("USER")
                        .build();

        UserDetails admin =
                User.withUsername("admin")
                        .password("password")
                        .authorities("ADMIN")
                        .build();

        String token = jwtUtil.generateToken(user);

        assertFalse(jwtUtil.validateToken(token, admin));
    }
}