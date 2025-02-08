package com.service.main.controller;

import com.service.main.dto.BookingDisputeDetailRequestDto;
import com.service.main.dto.ChangeDisputeStatusDto;
import com.service.main.dto.CustomPaging;
import com.service.main.dto.CustomResult;
import com.service.main.service.admin.DisputeADService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("disputeAD")
public class BookingDisputeADController {
    @Autowired
    private DisputeADService disputeADService;

    @GetMapping("get_dispute_list")
    @RolesAllowed({"ADMIN", "BOOKING_MANAGEMENT"})
    public ResponseEntity<CustomPaging> getAdminDisputeList(@RequestParam("pageNumber") int pageNumber,
                                                        @RequestParam("pageSize") int pageSize,
                                                        @RequestParam(value = "hostSearch", required = false, defaultValue = "") String hostSearch,
                                                        @RequestParam(value = "customerSearch", required = false, defaultValue = "") String customerSearch,
                                                        @RequestParam(value = "locationIds", required = false) List<Integer> locationIds,
                                                        @RequestParam("status") String status,
                                                        @RequestParam(value = "propertySearch", required = false) String propertySearch
                                                        ) {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customPaging = disputeADService.getDisputeList(email,
                pageNumber,
                pageSize,
                hostSearch,
                customerSearch,
                locationIds,
                status,
                propertySearch);

        return ResponseEntity.ok(customPaging);
    }

    @GetMapping("get_dispute_detail")
    @RolesAllowed({"ADMIN", "BOOKING_MANAGEMENT"})
    public ResponseEntity<CustomResult> getDisputeDetail(@RequestParam int disputeId) {
        var customResult = disputeADService.getDisputeDetail(disputeId);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("change_dispute_status")
    @RolesAllowed({"ADMIN", "BOOKING_MANAGEMENT"})
    public ResponseEntity<CustomResult> changeDisputeStatus(@ModelAttribute ChangeDisputeStatusDto changeDisputeStatusDto) {
        var customResult = disputeADService.changeDisputeStatus(changeDisputeStatusDto);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("add_dispute_detail")
    @RolesAllowed({"ADMIN", "BOOKING_MANAGEMENT"})
    public ResponseEntity<CustomResult> addDisputeDetail(@ModelAttribute BookingDisputeDetailRequestDto bookingDisputeDetailRequestDto) {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customResult = disputeADService.addMoreDetail(email, bookingDisputeDetailRequestDto);
        return ResponseEntity.ok(customResult);
    }


}
