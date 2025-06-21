package com.hahn.software.user;

import com.hahn.software.exception.CustomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @PatchMapping("/change-password")
    public ResponseEntity<CustomResponse> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal connectedUser
    ) {
        CustomResponse response = userService.changePassword(request, connectedUser);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/whoami")
    public UserResponse whoAmI() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return new UserResponse(
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}


