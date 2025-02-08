package com.service.main.controller;

import com.service.main.dto.CustomResult;
import com.service.main.dto.LoginDto;
import com.service.main.dto.ResetPasswordDto;
import com.service.main.service.admin.AuthADService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("authAD")
public class AuthADController {

    @Autowired
    private AuthADService authADService;

    @PostMapping
    public ResponseEntity<CustomResult> login(@ModelAttribute LoginDto loginDto) {
        CustomResult customResult = authADService.login(loginDto);
        return ResponseEntity.ok(customResult);
    }

    @RolesAllowed({"ADMIN", "EMPLOYEE"})
    @GetMapping
    public ResponseEntity<CustomResult> getAdmin() {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();

        var customResult = authADService.admin(email);

        return ResponseEntity.ok(customResult);
    }

    @RolesAllowed({"ADMIN", "EMPLOYEE", "EMPLOYEE_MANAGEMENT"})
    @PostMapping("reset_employee_password")
    public ResponseEntity<CustomResult> resetEmployeePassword(@ModelAttribute ResetPasswordDto resetPasswordDto) {

        var customResult = authADService.resetEmployeePasswoord(resetPasswordDto);
        return ResponseEntity.ok(customResult);
    }

    @RolesAllowed({"ADMIN", "EMPLOYEE"})
    @PostMapping("reset_password")
    public ResponseEntity<CustomResult> resetPassword(@ModelAttribute ResetPasswordDto resetPasswordDto) {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customResult = authADService.resetEmployeeOwnPasswoord(email, resetPasswordDto);
        return ResponseEntity.ok(customResult);
    }


}
