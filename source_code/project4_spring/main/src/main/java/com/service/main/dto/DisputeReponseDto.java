package com.service.main.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.service.main.entity.Booking;
import com.service.main.entity.BookingDisputeDetail;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisputeReponseDto {
    private Integer id;

    private BookingMinimizeDto booking;

    private String reason;

    private String images;

    private Integer groupChatId;

    private String status; // PENDING, IGNORE, PROGRESS, CLOSED

    private String resolution; // e.g., REFUND, NO_ACTION, PARTIAL_REFUND

    private Date createdAt;

    private Date updatedAt ;

    private Date acceptedAt;

    private List<BookingDisputeDetailResponseDto> bookingDisputeDetails;

}
