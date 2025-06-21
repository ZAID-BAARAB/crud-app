package com.hahn.software.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private String firstname;
    private String lastname;
    private String email;
    private String role;
}
