package com.service.main.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.service.main.entity.Booking;
import com.service.main.entity.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionMinimizeDto {
    private Integer id;

    private double amount;

    private String transactionType; // escrow, refund, webrevenue, hostrevenue

    private Date transferOn;

}
