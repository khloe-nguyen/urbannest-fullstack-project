package com.service.main.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDisputeDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "adminId")
    @JsonBackReference
    private Admin admin;

    @ManyToOne
    @JoinColumn(name = "bookingDisputeId")
    @JsonBackReference
    private BookingDispute bookingDispute;

    @Column(columnDefinition = "TEXT")
    private String customerReason;

    @Column(columnDefinition = "TEXT")
    private String customerImages;

    @Column(columnDefinition = "TEXT")
    private String hostReason;

    @Column(columnDefinition = "TEXT")
    private String hostImages;

    @Column(columnDefinition = "TEXT")
    private String adminNote;

    private Date createdAt = new Date();
}
