package com.service.main.controller;

import com.service.main.dto.CustomResult;
import com.service.main.service.admin.ChartADService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("chartAD")
public class ChartADController {

    @Autowired
    private ChartADService chartADService;

    @GetMapping("count")
    public ResponseEntity<CustomResult> getCount(@RequestParam String startDate, @RequestParam String endDate){
        var customResult = chartADService.getCountChartDashBoard(startDate, endDate);
        return ResponseEntity.ok(customResult);
    }

    @GetMapping("list_booking")
    public ResponseEntity<CustomResult> getListBooking(@RequestParam String startDate, @RequestParam String endDate){
        var customResult = chartADService.getBookingBasedOnDate(startDate, endDate);
        return ResponseEntity.ok(customResult);
    }

    @GetMapping("list_best_host")
    public ResponseEntity<CustomResult> getListBestHost(){
        var customResult = chartADService.getBestHost();
        return ResponseEntity.ok(customResult);
    }

}
