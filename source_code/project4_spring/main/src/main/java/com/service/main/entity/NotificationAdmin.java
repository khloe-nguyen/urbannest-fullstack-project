package com.service.main.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotificationAdmin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Integer id;

    private String message;

    private String url;

    private boolean isRead;

    private Date createdAt = new Date();

    @ManyToOne
    @JoinColumn(name = "adminId")
    @JsonBackReference
    private Admin admin;
}
