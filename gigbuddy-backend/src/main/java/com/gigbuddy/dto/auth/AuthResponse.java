package com.gigbuddy.dto.auth;

import com.gigbuddy.model.enums.Role;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private String message;
}
