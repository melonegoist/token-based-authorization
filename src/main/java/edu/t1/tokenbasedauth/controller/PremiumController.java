package edu.t1.tokenbasedauth.controller;

import edu.t1.tokenbasedauth.model.Role;
import edu.t1.tokenbasedauth.model.User;
import edu.t1.tokenbasedauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/premium")
@RequiredArgsConstructor
public class PremiumController {

    private final UserRepository userRepository;

    @GetMapping("/confirm-status")
    public ResponseEntity<String> getPremiumConfirmation(@RequestParam String login) {
        System.out.println("getPremiumConfirmation");

        User user = userRepository.findByLogin(login).orElseThrow();
        Set<Role> roles = user.getRoles();

        if (roles.contains(Role.PREMIUM_USER)) {
            return ResponseEntity.ok().body("Premium status confirmed");
        }

        return ResponseEntity.ok().body("Premium status not confirmed");
    }

    @GetMapping("/premium-page")
    public String getPremiumPage() {
        System.out.println("getPremiumPage");

        return "forward:/premium.html";
    }

}
