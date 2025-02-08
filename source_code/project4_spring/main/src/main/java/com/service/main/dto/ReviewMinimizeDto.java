package com.service.main.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.service.main.entity.Booking;
import com.service.main.entity.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.N;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewMinimizeDto {

    private Integer id;

    private Double totalScore;

    private Integer cleanlinessScore;

    private Integer accuracyScore;

    private Integer checkinScore;

    private Integer communicationScore;

    private UserDto user;

    private Integer toUser;

    private String review;

}
