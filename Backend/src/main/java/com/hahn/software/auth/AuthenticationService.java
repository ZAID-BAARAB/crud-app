package com.hahn.software.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.hahn.software.config.JwtService;
import com.hahn.software.exception.CustomResponse;
import com.hahn.software.token.Token;
import com.hahn.software.token.TokenRepository;
import com.hahn.software.token.TokenType;
import com.hahn.software.user.Role;
import com.hahn.software.user.User;
import com.hahn.software.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository repository;
  private final TokenRepository tokenRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  @Value("${spring.security.oauth2.client.registration.google.client-id}")
  private String googleClientId;
  private final JwtDecoder googleIdTokenDecoder;

  public ResponseEntity<?> register(RegisterRequest request) {


    // Check if a user with the same email already exists
    var existingUser = userRepository.findByEmail(request.getEmail().toLowerCase());
    if (existingUser.isPresent()) {
      CustomResponse customResponse = new CustomResponse(
              "Email already exists!, Try Login",
              HttpStatus.BAD_REQUEST
      );
      return new ResponseEntity<>(customResponse, HttpStatus.BAD_REQUEST);
    }

    // Create and save the user
    var user = User.builder()
            .firstname(request.getFirstname())
            .lastname(request.getLastname())
            .email(request.getEmail().toLowerCase())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .build();
    var savedUser = userRepository.save(user);



    // Generate tokens
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    saveUserToken(savedUser, jwtToken);

    // Return success response
    AuthenticationResponse authResponse = AuthenticationResponse.builder()
            .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .build();

    return new ResponseEntity<>(authResponse, HttpStatus.OK);
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getEmail().toLowerCase(),
                    request.getPassword()
            )
    );
    // Convert email to lowercase before searching
    String emailLowerCase = request.getEmail().toLowerCase();
    var user = userRepository.findByEmail(emailLowerCase)
            .orElseThrow();
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
//    revokeAllUserTokens(user);   we may need this line if we wat to restrict access  to same account many devices
    saveUserToken(user, jwtToken);
    return AuthenticationResponse.builder()
            .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .build();
  }

  //this method is to create new Admin account and should not be accessed by normal User
  public AuthenticationResponse registerAdmin(RegisterRequest request) {
    // Check if a user with the same email already exists
    var existingUser = userRepository.findByEmail(request.getEmail().toLowerCase());
    if (existingUser.isPresent()) {
      return AuthenticationResponse.builder()
              .accessToken("Email already exists")
              .refreshToken(null)
              .build();
    }

    var user = User.builder()
            .firstname(request.getFirstname())
            .lastname(request.getLastname())
            .email(request.getEmail().toLowerCase())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(request.getRole())
            .build();
    var savedUser = userRepository.save(user);
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    saveUserToken(savedUser, jwtToken);
    return AuthenticationResponse.builder()
            .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .build();
  }

  private void saveUserToken(User user, String jwtToken) {
    var token = Token.builder()
        .user(user)
        .token(jwtToken)
        .tokenType(TokenType.BEARER)
        .expired(false)
        .revoked(false)

        .build();
    tokenRepository.save(token);
  }

  private void revokeAllUserTokens(User user) {
    var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
    if (validUserTokens.isEmpty())
      return;
    validUserTokens.forEach(token -> {
      token.setExpired(true);
      token.setRevoked(true);
    });
    tokenRepository.saveAll(validUserTokens);
  }

// <=======  login with google ==============>
  public AuthenticationResponse googleLogin(GoogleRequest request) {
    // 1) Decode & verify the Google ID token
    Jwt googleJwt = googleIdTokenDecoder.decode(request.getIdToken());

    // 2) Check audience
    List<String> audience = googleJwt.getAudience();
    if (!audience.contains(googleClientId)) {
      throw new RuntimeException("Invalid audience on ID token");
    }

    // 3) Extract user info
    String email = googleJwt.getClaimAsString("email");
    String name  = googleJwt.getClaimAsString("name");

    // 4) Lookup or auto-register
    User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
              User u = new User();
              u.setEmail(email);
              u.setFirstname(name);
              u.setRole(Role.USER);
              // ... set defaults, e.g. role ...
              return userRepository.save(u);
            });

    // 5) Mint your own JWTs
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
//    revokeAllUserTokens(user);   we may need this line if we wat to restrict access  to same account many devices
    saveUserToken(user, jwtToken);
    return AuthenticationResponse.builder()
            .accessToken(jwtToken)
            .refreshToken(refreshToken)
            .build();
  }


  public void refreshToken(
          HttpServletRequest request,
          HttpServletResponse response
  ) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;
    if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
      return;
    }
    refreshToken = authHeader.substring(7);
    userEmail = jwtService.extractUsername(refreshToken);
    if (userEmail != null) {
      var user = this.repository.findByEmail(userEmail)
              .orElseThrow();
      if (jwtService.isTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);
        var authResponse = AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }
}
