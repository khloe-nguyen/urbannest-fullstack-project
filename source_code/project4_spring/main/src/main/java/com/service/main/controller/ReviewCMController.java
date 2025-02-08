package com.service.main.controller;

import com.service.main.dto.CustomPaging;
import com.service.main.dto.CustomResult;
import com.service.main.dto.RateByHostDto;
import com.service.main.dto.RateByUserDto;
import com.service.main.service.customer.ReviewCMService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("reviewCM")
public class ReviewCMController {

    @Autowired
    private ReviewCMService reviewCMService;

    @PostMapping("review_by_host")
    @RolesAllowed("USER")
    public ResponseEntity<CustomResult> reviewByHost(@ModelAttribute RateByHostDto rateByHostDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        var customResult = reviewCMService.rateByHost(email, rateByHostDto);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("review_by_customer")
    @RolesAllowed("USER")
    public ResponseEntity<CustomResult> reviewByCustomer(@ModelAttribute RateByUserDto rateByUserDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        var customResult = reviewCMService.rateByCustomer(email, rateByUserDto);
        return ResponseEntity.ok(customResult);
    }

    @GetMapping("user_review")
    @RolesAllowed("USER")
    public ResponseEntity<CustomPaging> getUserReview(@RequestParam int pageNumber, @RequestParam int pageSize, @RequestParam String status) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        var customResult = reviewCMService.getUserReview(email, pageNumber, pageSize, status);
        return ResponseEntity.ok(customResult);

    }

    @GetMapping("property_review")
    @RolesAllowed("USER")
    public ResponseEntity<CustomPaging> getPropertyReview(@RequestParam int pageNumber, @RequestParam int pageSize, @RequestParam String status, @RequestParam int propertyId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        var customResult = reviewCMService.getPropertyReview(email,propertyId, pageNumber, pageSize, status);
        return ResponseEntity.ok(customResult);

    }

    @GetMapping("get_reviews_of_property")
    public  ResponseEntity<CustomPaging> getAllReviewOfProperty(@RequestParam int pageNumber, @RequestParam int pageSize, @RequestParam int propertyId) {
        var customResult = reviewCMService.getListReviewOfProperty(propertyId, pageNumber, pageSize);
        return ResponseEntity.ok(customResult);
    }

    @GetMapping("get_all_reviews_of_property")
    public  ResponseEntity<CustomResult> getAllReviewOfProperty( @RequestParam int propertyId) {
        var customResult = reviewCMService.getListReviewOfProperty(propertyId );
        return ResponseEntity.ok(customResult);
    }

}
