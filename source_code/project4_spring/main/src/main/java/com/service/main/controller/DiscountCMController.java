package com.service.main.controller;

import com.service.main.dto.CustomResult;
import com.service.main.dto.DiscountCreateDto;
import com.service.main.service.customer.DiscountCMService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("discountCM")
public class DiscountCMController {

    @Autowired
    private DiscountCMService discountCMService;

    @PostMapping("create_dicount")
    @RolesAllowed({"USER"})
    public ResponseEntity<CustomResult> createDiscount(@ModelAttribute DiscountCreateDto discountCreateDto){
        var email = SecurityContextHolder.getContext().getAuthentication().getName();

        var customResult = discountCMService.createDiscount(email,discountCreateDto);
        return ResponseEntity.ok(customResult);
    }
}
