package com.service.chat.controller;


import com.service.chat.dto.ChatMessageDto;
import com.service.chat.dto.PushNotificationDto;
import com.service.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.reactive.function.BodyInserters;


import java.util.HashMap;
import java.util.Objects;


@Controller
public class ChatSocketController {

    @Autowired
    private RestClient restClient;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private ChatService chatService;

    @MessageMapping("/private-message")
    public ChatMessageDto recMessage(@Payload ChatMessageDto message) {
        var roomUsers = chatService.getChatRoomById(message.getRoomId());

        if (roomUsers != null) {

            chatService.saveUserMessage(message);

            for (Long id : roomUsers) {
                simpMessagingTemplate.convertAndSendToUser(String.valueOf(id), "/private", message);




                if(!Objects.equals(id, message.getSenderId())){

                    var data = new HashMap<String, String>();
                    data.put("type", "message");
                    data.put("roomId", message.getRoomId().toString());



                    var pushNotificationDto = new PushNotificationDto();
                    pushNotificationDto.setImage((message.getSenderAvatar() != null && !message.getSenderAvatar().isEmpty()) ? message.getSenderAvatar() : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" );
                    pushNotificationDto.setBody(message.getMessage());
                    pushNotificationDto.setSubject("New message");
                    pushNotificationDto.setData(data);
                    pushNotificationDto.setUserId(id.intValue());

                    restClient.post()
                            .uri("/firebaseCM/send_notification")
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(pushNotificationDto) // Updated to bodyValue
                            .retrieve()
                            .toBodilessEntity();
                }
            }

        }
        return message;
    }

}
