package com.service.main.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyDiscount {
    @EmbeddedId
    private PropertyDiscountId id;

    @ManyToOne
    @JoinColumn(name = "property_id")
    @MapsId("propertyId")
    @JsonBackReference
    private Property property;

    @ManyToOne
    @JoinColumn(name = "discount_id")
    @MapsId("discountId")
    @JsonBackReference
    private Discount discount;
}
