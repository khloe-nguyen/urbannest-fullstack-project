package com.service.main.controller;

import com.service.main.dto.CustomResult;
import com.service.main.dto.DisputeRequestDto;
import com.service.main.service.customer.DisputeCMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("disputeCM")
public class BookingDisputeCMController {

    @Autowired
    private DisputeCMService disputeCMService;


    @PostMapping("new_report")
    public ResponseEntity<CustomResult> customerReportBooking(@ModelAttribute DisputeRequestDto disputeRequestDto){
        var customResult = disputeCMService.reportBooking(disputeRequestDto);
        return new ResponseEntity<>(customResult, HttpStatus.OK);
    }
}
