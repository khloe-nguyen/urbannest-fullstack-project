package com.service.main.controller;

import com.service.main.dto.CustomResult;
import com.service.main.dto.FCMTokenDto;
import com.service.main.dto.LoginDto;
import com.service.main.dto.RegisterDto;
import com.service.main.service.customer.AuthCMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

@RestController
@RequestMapping("authCM")
public class AuthCMController {

    @Autowired
    private AuthCMService authCMService;


    @GetMapping
    public ResponseEntity<CustomResult> user(){
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customResult = authCMService.getUser(email);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("login_signup")
    public ResponseEntity<CustomResult> checkLoginOrSignUp(String email){
        var customResult = authCMService.checkEmailExist(email);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("create_authentication_code")
    public ResponseEntity<CustomResult> createAuthenticationCode(String email){
        var customResult = authCMService.createAuthenticationCode(email);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("register")
    public ResponseEntity<CustomResult> register(RegisterDto registerDto){
        var customResult = authCMService.userRegister(registerDto);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("register_by_google")
    public ResponseEntity<CustomResult> registerByGoogle(RegisterDto registerDto){
        var customResult = authCMService.userRegisterByGoogle(registerDto);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("login")
    public ResponseEntity<CustomResult> login(LoginDto loginDto){
        var customResult = authCMService.login(loginDto);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("login_by_mobile")
    public ResponseEntity<CustomResult> loginByMobile(LoginDto loginDto){
        var customResult = authCMService.loginByMobile(loginDto);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("logout_by_mobile")
    public ResponseEntity<CustomResult> logoutByMobile(FCMTokenDto fcmTokenDto){
        var customResult = authCMService.deleteFCMToken(fcmTokenDto);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("login_sign_up_google")
    public ResponseEntity<CustomResult> loginGoogle(String email){
        var customResult = authCMService.loginOrSignUpByGoogle(email);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("login_by_QR_code")
    @RolesAllowed({"USER"})
    public ResponseEntity<CustomResult> loginByQrCode(){
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customResult = authCMService.generateTokenForQrCode(email);
        return ResponseEntity.ok(customResult);
    }

}
