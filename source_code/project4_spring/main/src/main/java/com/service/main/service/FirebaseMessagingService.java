package com.service.main.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

import com.service.main.dto.CustomResult;
import com.service.main.dto.PushNotificationDto;
import com.service.main.repository.FCMTokenRepository;
import com.service.main.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FirebaseMessagingService {

    @Autowired
    private FirebaseMessaging firebaseMessaging;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FCMTokenRepository fcmTokenRepository;



    public CustomResult sendNotificationToUser(PushNotificationDto pushNotificationDto){
        try{
            var tokens = fcmTokenRepository.findAllByUserId(pushNotificationDto.getUserId());

            for(var token : tokens){
                try{
                    var newPushNotificationDto = new PushNotificationDto();
                    BeanUtils.copyProperties(pushNotificationDto, newPushNotificationDto);
                    newPushNotificationDto.setToken(token.getFCMToken());
                    newPushNotificationDto.setData(pushNotificationDto.getData());
                    sendNotification(newPushNotificationDto);
                }catch (Exception e){
                    System.out.println(e.toString());
                }

            }

            return new CustomResult(200, "Success", null);
        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }

    public String sendNotification(PushNotificationDto pushNotificationDto) throws FirebaseMessagingException {

        Notification notification = Notification
                .builder()
                .setTitle(pushNotificationDto.getSubject())
                .setBody(pushNotificationDto.getBody())
                .setImage(pushNotificationDto.getImage())
                .build();

        Message message = Message
                .builder()
                .setToken(pushNotificationDto.getToken())
                .setNotification(notification)
                .putAllData(pushNotificationDto.getData())
                .build();

        var firebase = firebaseMessaging;

        return firebase.send(message);
    }
}
