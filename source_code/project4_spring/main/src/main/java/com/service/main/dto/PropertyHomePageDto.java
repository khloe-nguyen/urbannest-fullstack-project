package com.service.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyHomePageDto {

    private int id;

    private String propertyTitle;

    private double basePrice;

    private String addressCode;

    private List<String> propertyImages;

    private double averageRating;
}
