package com.service.main.controller;

import com.service.main.dto.CustomPaging;
import com.service.main.dto.CustomResult;
import com.service.main.dto.NotificationResponseDto;
import com.service.main.service.customer.NotificationCMService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("notificationCM")
public class NotificationCMController {

    @Autowired
    private NotificationCMService notificationCMService;

    @GetMapping("get_notification_popup")
    public ResponseEntity<CustomResult> getNotificationPopup() {
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customResult = notificationCMService.getUserPopUpNotification(email);
        return ResponseEntity.ok(customResult);
    }

    @GetMapping("get_notification")
    @RolesAllowed({"USER"})
    public ResponseEntity<CustomPaging> getUserList(@RequestParam int pageNumber,
                                                        @RequestParam int pageSize,
                                                        @RequestParam(required = false) Boolean status
    ){
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customPaging = notificationCMService.getCustomerNotification(pageNumber, pageSize,email, status);
        return ResponseEntity.ok(customPaging);
    }

    @PostMapping("delete_notification")
    @RolesAllowed({"USER"})
    public ResponseEntity<CustomResult> deleteNotification(@ModelAttribute NotificationResponseDto notificationResponseDto)
    {
        var customResult = notificationCMService.removeNotification(notificationResponseDto.getId());
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("update_notification")
    @RolesAllowed({"USER"})
    public ResponseEntity<CustomResult> updateNotification(@ModelAttribute NotificationResponseDto notificationResponseDto)
    {
        var customResult = notificationCMService.changeNotificationReadStatus(notificationResponseDto.getId());
        return ResponseEntity.ok(customResult);
    }
}
