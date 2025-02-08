package com.service.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePropertyPriceDto {
    int propertyId;
    double price;
    int weeklyDiscount;
    int monthlyDiscount;
}
