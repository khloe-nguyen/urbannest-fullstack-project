package com.service.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UpdateExceptionDateDto {
    private int propertyId;

    private String start;

    private String end;

    private double price;

    private List<String> dates;
}
