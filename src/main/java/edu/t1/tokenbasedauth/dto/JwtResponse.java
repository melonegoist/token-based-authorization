package edu.t1.tokenbasedauth.dto;

import edu.t1.tokenbasedauth.model.Role;

import java.util.Set;

public record JwtResponse(
        String token,
        String refreshToken,
        Long id,
        String login, // TODO here was username
        String email,
        Set<Role> roles
) {}
