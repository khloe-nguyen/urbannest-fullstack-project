package com.service.main.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.service.main.entity.Admin;
import com.service.main.entity.BookingDispute;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDisputeDetailResponseDto {

    private Integer id;

    private AdminDto admin;

    private String customerReason;

    private String customerImages;

    private String hostReason;

    private String hostImages;

    private String adminNote;

    private Date createdAt;

}
