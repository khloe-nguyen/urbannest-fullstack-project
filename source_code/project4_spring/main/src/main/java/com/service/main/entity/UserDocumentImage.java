package com.service.main.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class UserDocumentImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "userId")
    @JsonBackReference
    private User user;

    private String address;
    private String phoneNumber;
    private String realAvatar;
    private String identityCardFrontUrl;
    private String identityCardBackUrl;
    private String driverLicenseCountry;
    private String driverLicenseFrontUrl;
    private String driverLicenseBackUrl;
    private String status; // PENDING, ACCEPTED, DENY
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    @Override
    public String toString() {
        return "UserDocumentImage{" +
                "id=" + id +
                ", address='" + address + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
