package com.service.main.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.A;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDispute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "bookingId")
    @JsonBackReference
    private Booking booking;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String images;

    private Integer groupChatId;

    private String status; // PENDING, IGNORE, PROGRESS, CLOSED

    @Column(columnDefinition = "TEXT")
    private String resolution;

    private Date createdAt = new Date();

    private Date acceptedAt;

    private Date updatedAt = new Date();

    @OneToMany(mappedBy = "bookingDispute", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<BookingDisputeDetail> bookingDisputeDetails;
}
