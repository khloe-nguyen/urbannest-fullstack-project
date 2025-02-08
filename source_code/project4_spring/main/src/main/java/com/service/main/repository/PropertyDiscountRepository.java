package com.service.main.repository;

import com.service.main.entity.PropertyDiscount;
import com.service.main.entity.PropertyDiscountId;
import org.springframework.data.repository.CrudRepository;

public interface PropertyDiscountRepository extends CrudRepository<PropertyDiscount, PropertyDiscountId> {
}
