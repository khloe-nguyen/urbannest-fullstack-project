package com.service.main.controller;

import com.service.main.dto.CustomPaging;
import com.service.main.service.admin.ReviewADService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("reviewAD")
public class ReviewADController {

    @Autowired
    private ReviewADService reviewADService;

    @GetMapping("get_property_review")
    @RolesAllowed({"ADMIN", "PROPERTY_MANAGEMENT"})
    public ResponseEntity<CustomPaging> getPropertyReview(@RequestParam  int propertyId,
                                                          @RequestParam int pageNumber,
                                                          @RequestParam int pageSize,
                                                          @RequestParam(required = false, defaultValue = "") String search,
                                                          @RequestParam String status) {
        var customPaging = reviewADService.getPropertyReview( propertyId,
         pageNumber,
         pageSize,
         search,
         status);

        return ResponseEntity.ok(customPaging);
    }
}
