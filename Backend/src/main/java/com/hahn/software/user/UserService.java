package com.hahn.software.user;

import com.hahn.software.exception.CustomResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    // <========= change password ===================>
    public CustomResponse changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return new CustomResponse("Wrong password", HttpStatus.BAD_REQUEST);
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            return new CustomResponse("Passwords are not the same", HttpStatus.BAD_REQUEST);
        }
        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        // save the new password
        userRepository.save(user);
        return new CustomResponse("Password changed successfully", HttpStatus.OK);
    }


//    public User getCurrentUser() {
//        UserDetails userDetails = (UserDetails) SecurityContextHolder
//                .getContext()
//                .getAuthentication()
//                .getPrincipal();
//        String username = userDetails.getUsername();
//        return userRepository.findByEmail(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//    }

    public User getCurrentUser() {
        // Grab the Authentication from the security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // auth.getName() is whatever you set as the JWT subject (your email)
        String email = auth.getName();
        System.out.println("email"+ email);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    //update profile
//    public CustomResponse updateProfile(UserRequest request) {
//        // Get the currently authenticated user
//        User user = getCurrentUser();
//
//        // Update the user details with the new values from the request
//        if (request.getFirstname() != null && !request.getFirstname().isEmpty()) {
//            user.setFirstname(request.getFirstname());
//        }
//
//        if (request.getLastname() != null && !request.getLastname().isEmpty()) {
//            user.setLastname(request.getLastname());
//        }
//
//        // Save the updated user
//        userRepository.save(user);
//
//        return new CustomResponse("Profile updated successfully", HttpStatus.OK);
//    }


}
