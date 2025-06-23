package com.hahn.software.auth;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;
import com.hahn.software.user.User;
import com.hahn.software.user.UserRepository;
import com.hahn.software.token.TokenRepository;
import com.hahn.software.config.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Optional;

class AuthenticationServiceTest {

    @Mock UserRepository userRepository;
    @Mock TokenRepository tokenRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock AuthenticationManager authenticationManager;

    @InjectMocks
    AuthenticationService authenticationService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_shouldReturnBadRequest_ifEmailExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(new User()));

        // Act
        ResponseEntity<?> response = authenticationService.register(request);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).extracting("message").isEqualTo("Email already exists!, Try Login");
    }

    @Test
    void register_shouldReturnAuthenticationResponse_whenSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setFirstname("John");
        request.setLastname("Doe");
        request.setPassword("password");
        request.setRole(null); 

        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        User savedUser = User.builder()
                .email("new@example.com")
                .firstname("John")
                .lastname("Doe")
                .password("encodedPassword")
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("jwtToken");
        when(jwtService.generateRefreshToken(savedUser)).thenReturn("refreshToken");

        // Act
        ResponseEntity<?> responseEntity = authenticationService.register(request);

        // Assert
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        AuthenticationResponse authResponse = (AuthenticationResponse) responseEntity.getBody();
        assertThat(authResponse.getAccessToken()).isEqualTo("jwtToken");
        assertThat(authResponse.getRefreshToken()).isEqualTo("refreshToken");

        verify(tokenRepository).save(any());
    }
}
