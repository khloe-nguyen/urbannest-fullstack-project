package com.service.main.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String code;

    private boolean isPrivate;

    private int quantityLeft;

    private int quantity;

    private int discountPercentage;

    private double maximumDiscount;

    private double minimumPriceRequirement;

    private int maximumStayRequirement;

    private Date expiredDate;

    private Date startDate;

    private String status;

    private Date createdAt;

    private Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "badgeRequirementId", nullable = true)
    @JsonBackReference
    private Badge badgeRequirement;

    @PrePersist
    void onCreate(){
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @OneToMany(mappedBy = "discount", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<PropertyDiscount> propertyDiscounts;

    @ManyToOne
    @JoinColumn(name = "userId")
    @JsonBackReference
    private User user;
}
