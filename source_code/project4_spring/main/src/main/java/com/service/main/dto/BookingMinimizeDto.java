package com.service.main.dto;

import com.service.main.entity.*;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingMinimizeDto {

    private Integer id;

    private Date checkInDay;

    private Date checkOutDay;

    private int totalPerson;

    private int adult;

    private int children;

    private String bookingType;

    private boolean isSelfCheckIn;

    private String selfCheckInType;

    private String selfCheckInInstruction;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String status;

    private PropertyMinimizeDto property;

    private RefundDto refundPolicy;

    private ReviewMinimizeDto hostReview;

    private ReviewMinimizeDto userReview;

    private UserDto host;

    private double amount;

    private String bookingCode;

    private UserDto customer;

    private double websiteFee;

    private double hostFee;

    private List<TransactionMinimizeDto> transactions;

    private List<BookDateDetailDto> bookDateDetails;
}
