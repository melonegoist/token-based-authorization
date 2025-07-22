package edu.t1.tokenbasedauth.controller;

import edu.t1.tokenbasedauth.CustomUserDetailsService;
import edu.t1.tokenbasedauth.config.JwtUtils;
import edu.t1.tokenbasedauth.dto.JwtResponse;
import edu.t1.tokenbasedauth.dto.SignInRequest;
import edu.t1.tokenbasedauth.dto.SignUpRequest;
import edu.t1.tokenbasedauth.model.User;
import edu.t1.tokenbasedauth.repository.UserRepository;
import io.jsonwebtoken.Jwt;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;


    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest request) {
        if (userRepository.existsByLogin(request.login())) return ResponseEntity.badRequest().body("Username already exists!");
        if (userRepository.existsByEmail(request.email())) return  ResponseEntity.badRequest().body("Email already in use!");

        User user = new User();

        user.setLogin(request.login());
        user.setEmail(request.email());
        user.setPassword(handlePassword(request.password()));
        user.setRoles(request.roles());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> signIn(@RequestBody SignInRequest request) {
        var auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.login(), request.password()));
        SecurityContextHolder.getContext().setAuthentication(auth);

        User user = (User) auth.getPrincipal();
        CustomUserDetailsService userDetailsService = new CustomUserDetailsService(user);

        // TODO
        String token = jwtUtils.generateToken(userDetailsService);
        String refreshToken = jwtUtils.generateRefreshToken(userDetailsService);

        return ResponseEntity.ok(new JwtResponse(
                token,
                refreshToken,
                user.getId(),
                user.getLogin(),
                user.getEmail(),
                user.getRoles()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshToken(@RequestBody String refreshToken) {
        String login = jwtUtils.getLoginFromToken(refreshToken);
        User user = userRepository.findByLogin(login).orElseThrow();
        CustomUserDetailsService userDetailsService = new CustomUserDetailsService(user);
        String newToken = jwtUtils.generateToken(userDetailsService);

        return ResponseEntity.ok(new JwtResponse(
                newToken,
                refreshToken,
                user.getId(),
                user.getLogin(),
                user.getEmail(),
                user.getRoles()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Logout successfully!");
    }

    private String handlePassword(String password) {
        return passwordEncoder.encode(password);
    }

}
