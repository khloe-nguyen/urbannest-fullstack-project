package com.service.main.dto.userDto.response;

import lombok.Data;

import java.util.ArrayList;

@Data
public class UserRefillResponse {
    private ArrayList<String> message = new ArrayList<>();
    private boolean isComplete;
    private int progress = 0;
}
