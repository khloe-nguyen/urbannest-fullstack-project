package com.service.main.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardCountDto {
    private Double totalEarning;
    private Integer bookings;
    private Integer customers;
    private Integer properties;
}
