package com.service.main.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.service.main.entity.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyMinimizeDto {
    private Integer id;

    private String propertyType;

    private String propertyTitle;

    private int maximumMonthPreBook;

    private String bookingType;

    private double basePrice;

    private int weeklyDiscount;

    private int monthlyDiscount;

    private String addressCode;

    private String addressDetail;

    private String checkInAfter;

    private String checkOutBefore;

    private int maximumGuest;

    private int numberOfBathRoom;

    private int numberOfBedRoom;

    private int numberOfBed;

    private boolean isPetAllowed;

    private boolean isSmokingAllowed;

    private String additionalRules;

    private Integer maximumStay;

    private Integer minimumStay;

    private String aboutProperty;

    private String guestAccess;

    private String detailToNote;

    private boolean isSelfCheckIn;

    private String selfCheckInType;

    private String selfCheckInInstruction;

    private String coordinatesX;

    private String coordinatesY;

    private String suggestion;

    private String status;

    private Date createdAt;

    private Date updatedAt;

    private ManagedCityDto managedCity;

    private RefundDto refundPolicy;

    private UserAuthDto user;

    private CategoryDto propertyCategory;

    private BadgeDto instantBookRequirement;

    private List<String> propertyImages;

    private List<PropertyNotAvailableDateDto> propertyNotAvailableDates;

    private List<PropertyExceptionDateDto> propertyExceptionDates;

    private List<AmenityDto> propertyAmenities;
}
