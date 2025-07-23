package edu.t1.tokenbasedauth.controller;

import edu.t1.tokenbasedauth.model.Role;
import edu.t1.tokenbasedauth.model.User;
import edu.t1.tokenbasedauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/confirm-status")
    public ResponseEntity<String> getAdminConfirmation(@RequestParam String login) {
        System.out.println("getAdminConfirmation");

        User user = userRepository.findByLogin(login).orElseThrow();
        Set<Role> roles = user.getRoles();

        if (roles.contains(Role.ADMIN)) {
            return ResponseEntity.ok().body("Admin status confirmed");
        }

        return ResponseEntity.ok().body("Admin status not confirmed");
    }

    @GetMapping("/admin-page")
    public String getAdminPage() {
        System.out.println("getAdminPage");

        return "forward:/admin.html";
    }

}
