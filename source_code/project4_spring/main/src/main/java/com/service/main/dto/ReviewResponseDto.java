package com.service.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponseDto {
    private Integer id;

    private Double totalScore;

    private Integer cleanlinessScore;

    private Integer accuracyScore;

    private Integer checkinScore;

    private Integer communicationScore;

    private UserAuthDto toUser;

    private String review;

    private Date createdAt;

    private Date updatedAt;

    private UserAuthDto user;

}
