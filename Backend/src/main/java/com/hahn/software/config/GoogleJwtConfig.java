package com.hahn.software.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration
public class GoogleJwtConfig {

    @Bean
    public JwtDecoder googleIdTokenDecoder() {
        // Google's public JWK set for verifying ID tokens
        String jwkSetUri = "https://www.googleapis.com/oauth2/v3/certs";
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }
}
