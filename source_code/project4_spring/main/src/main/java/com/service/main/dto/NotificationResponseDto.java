package com.service.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseDto {
    private Integer id;

    private String message;

    private String url;

    private boolean isRead;

    private Date createdAt;
}
