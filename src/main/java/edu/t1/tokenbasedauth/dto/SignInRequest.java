package edu.t1.tokenbasedauth.dto;

public record SignInRequest(
        String login,
        String password
) {}
