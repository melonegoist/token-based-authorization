package edu.t1.tokenbasedauth.dto;

import edu.t1.tokenbasedauth.model.Role;

import java.util.Set;

public record SignUpRequest(
        String login,
        String email,
        String password,
        Set<Role> roles
) {}
