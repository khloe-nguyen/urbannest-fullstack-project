package com.service.main.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.service.main.entity.Badge;
import com.service.main.entity.Property;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCreateDto {
    private String name;

    private String code;

    private boolean isPrivate;

    private int quantity;

    private int discountPercentage;

    private double maximumDiscount;

    private double minimumPriceRequirement;

    private int maximumStayRequirement;

    private int minimumStayRequirement;

    private String expiredDate;

    private String startDate;

    private String status;

    private Integer badgeRequirementId;

    private List<Integer> propertyIds;
}
