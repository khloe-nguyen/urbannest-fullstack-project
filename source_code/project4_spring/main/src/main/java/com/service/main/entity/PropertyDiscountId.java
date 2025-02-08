package com.service.main.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PropertyDiscountId implements Serializable {
    private Integer propertyId;
    private Integer discountId;
}
