package com.service.main.controller;

import com.service.main.dto.CustomResult;
import com.service.main.dto.PushNotificationDto;
import com.service.main.service.FirebaseMessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("firebaseCM")
public class FirebaseMessagingController {

    @Autowired
    private FirebaseMessagingService firebaseMessagingService;

    @PostMapping("send_notification")
    public ResponseEntity<CustomResult> sendFCMNotification(@RequestBody PushNotificationDto pushNotificationDto){
        var customResult = firebaseMessagingService.sendNotificationToUser(pushNotificationDto);
        return ResponseEntity.ok(customResult);
    }
}
