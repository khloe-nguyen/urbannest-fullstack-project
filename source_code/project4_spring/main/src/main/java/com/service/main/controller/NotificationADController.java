package com.service.main.controller;


import com.service.main.dto.AdminForgotPasswordNotification;
import com.service.main.dto.CustomPaging;
import com.service.main.dto.CustomResult;
import com.service.main.dto.NotificationResponseDto;
import com.service.main.service.admin.NotificationADService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("notificationAD")
public class NotificationADController {
    @Autowired
    private NotificationADService notificationADService;


    @GetMapping("get_notification")
    @RolesAllowed({"ADMIN", "EMPLOYEE"})
    public ResponseEntity<CustomPaging> getEmployeeList(@RequestParam int pageNumber,
                                                        @RequestParam int pageSize,
                                                        @RequestParam(required = false) Boolean status
    ){
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customPaging = notificationADService.getAdminNotification(pageNumber, pageSize,email, status);
        return ResponseEntity.ok(customPaging);
    }

    @PostMapping("send_forgot_password")
    public ResponseEntity<CustomResult> notifyForgotPassword(@ModelAttribute AdminForgotPasswordNotification adminForgotPasswordNotification)
    {
        var customResult = notificationADService.notificationForgotPassword(adminForgotPasswordNotification);
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("delete_notification")
    @RolesAllowed({"ADMIN", "EMPLOYEE"})
    public ResponseEntity<CustomResult> deleteNotification(@ModelAttribute NotificationResponseDto notificationResponseDto)
    {
        var customResult = notificationADService.removeNotification(notificationResponseDto.getId());
        return ResponseEntity.ok(customResult);
    }

    @PostMapping("update_notification")
    @RolesAllowed({"ADMIN", "EMPLOYEE"})
    public ResponseEntity<CustomResult> updateNotification(@ModelAttribute NotificationResponseDto notificationResponseDto)
    {
        var customResult = notificationADService.changeNotificationReadStatus(notificationResponseDto.getId());
        return ResponseEntity.ok(customResult);
    }
}
