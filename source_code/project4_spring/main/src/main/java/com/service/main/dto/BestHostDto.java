package com.service.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BestHostDto {

    private Integer id;

    private String email;

    private String firstName ;

    private String lastName;

    private String address;

    private String phoneNumber;

    private String avatar;

    private Date dob;

    private Date createdAt;

    private PropertyHomePageDto bestProperty;

    private double revenue;
}
