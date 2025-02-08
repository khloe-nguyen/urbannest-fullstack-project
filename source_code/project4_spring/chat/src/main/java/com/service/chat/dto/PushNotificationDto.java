package com.service.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PushNotificationDto {
    private int userId;
    private String token;
    private String subject;
    private String body;
    private String image;
    private Map<String,String> data;
}
