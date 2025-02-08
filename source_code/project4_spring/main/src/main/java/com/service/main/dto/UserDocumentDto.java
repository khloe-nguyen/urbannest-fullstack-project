package com.service.main.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDocumentDto {
    private Integer id;
    private UserAuthDto user;
    private String address;
    private String phoneNumber;
    private String realAvatar;
    private String identityCardFrontUrl;
    private String identityCardBackUrl;
    private String driverLicenseCountry;
    private String driverLicenseFrontUrl;
    private String driverLicenseBackUrl;
    private String status; // PENDING, ACCEPTED, DENY
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
}
