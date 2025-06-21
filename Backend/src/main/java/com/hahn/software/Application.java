package com.hahn.software;

import com.hahn.software.auth.AuthenticationResponse;
import com.hahn.software.auth.AuthenticationService;
import com.hahn.software.auth.RegisterRequest;
import com.hahn.software.exception.CustomResponse;
import com.hahn.software.user.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.ResponseEntity;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
//next bean creates a default admin and a Manager Account
	@Bean
	public CommandLineRunner commandLineRunner(
			AuthenticationService authenticationService
	) {
		return args -> {
			var admin = RegisterRequest.builder()
					.firstname("Admin")
					.lastname("Admin")
					.email("zaidAdmin@mail.com")
					.password("password")
					.role(Role.ADMIN)
					.build();
			System.out.println("Admin token: " + authenticationService.registerAdmin(admin).getAccessToken());

			var client = RegisterRequest.builder()
					.firstname("Client")
					.lastname("Client")
					.email("client@mail.com")
					.password("password")
					.role(Role.USER)
					.build();
			//System.out.println("Client token: " + authenticationService.register(client).getAccessToken());
			handleRegisterResponse(authenticationService.register(client), "Client");

		};
	}

	private void handleRegisterResponse(ResponseEntity<?> responseEntity, String userType) {
		if (responseEntity.getBody() instanceof AuthenticationResponse) {
			AuthenticationResponse authResponse = (AuthenticationResponse) responseEntity.getBody();
			System.out.println(userType + " token: " + authResponse.getAccessToken());
		} else if (responseEntity.getBody() instanceof CustomResponse) {
			CustomResponse customResponse = (CustomResponse) responseEntity.getBody();
			System.out.println(userType + " registration failed: " + customResponse.getMessage());
		}
	}
}
