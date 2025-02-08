package com.service.main.dto;

import com.service.main.entity.Badge;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class UserAuthDto {
    private Integer id;

    private String email;

    private String firstName ;

    private String lastName;

    private String address;

    private String phoneNumber;

    private String avatar;

    private Date dob;

    private boolean isHost;

    private List<BadgeDto> badgeList;

    private Date createdAt;

    private String preferredName;

    private String identityCardCountry;

    private String identityCardFrontUrl;

    private String identityCardBackUrl;

    private String driverLicenseCountry;

    private String driverLicenseFrontUrl;

    private String driverLicenseBackUrl;

    private String OTP;

    private String newPassword;

    private String realAvatar;

    List<Integer> propertyFavouriteIds;

}
