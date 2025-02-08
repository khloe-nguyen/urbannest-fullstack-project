package com.service.main.service.customer;

import com.service.main.dto.CustomResult;
import com.service.main.dto.DiscountCreateDto;
import com.service.main.entity.Discount;
import com.service.main.entity.PropertyDiscount;
import com.service.main.entity.PropertyDiscountId;
import com.service.main.repository.*;
import com.service.main.service.StringGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class DiscountCMService {

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyDiscountRepository propertyDiscountRepository;

    @Autowired
    private StringGenerator stringGenerator;

    public CustomResult createDiscount(String email,DiscountCreateDto discountCreateDto) {
        try{

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            var discount = new Discount();
            discount.setName(discountCreateDto.getName());
            discount.setDiscountPercentage(discountCreateDto.getDiscountPercentage());
            discount.setCreatedAt(new Date());
            discount.setUpdatedAt(new Date());
            discount.setCode(discountCreateDto.getCode());
            discount.setMaximumDiscount(discountCreateDto.getMaximumDiscount());
            if(discountCreateDto.getBadgeRequirementId() != null){
                discount.setBadgeRequirement(badgeRepository.findById(discountCreateDto.getBadgeRequirementId()).orElse(null));
            }
            discount.setUser(userRepository.findUserByEmail(email));
            discount.setStartDate(sdf.parse(discountCreateDto.getStartDate()));
            if(discountCreateDto.getExpiredDate() != null ){
                discount.setExpiredDate(sdf.parse(discountCreateDto.getExpiredDate()));
            }

            discount.setPrivate(discountCreateDto.isPrivate());
            discount.setMinimumPriceRequirement(discountCreateDto.getMinimumPriceRequirement());
            discount.setMinimumPriceRequirement(discountCreateDto.getMinimumPriceRequirement());
            discount.setQuantityLeft(0);
            discount.setStatus("PENDING");
            discount.setQuantity(discountCreateDto.getQuantity());
            discount.setCode(stringGenerator.generateRandomString(10).toUpperCase());


            discountRepository.save(discount);

            for(var id: discountCreateDto.getPropertyIds()){
                var property = propertyRepository.findById(id).orElse(null);

                if(property == null){
                    return new CustomResult(404, "Property not found", null);
                }

                var propertyDiscount = new PropertyDiscount();
                propertyDiscount.setDiscount(discount);
                propertyDiscount.setProperty(property);
                var propertyDiscountId = new PropertyDiscountId();
                propertyDiscountId.setDiscountId(discount.getId());
                propertyDiscountId.setPropertyId(property.getId());

                propertyDiscount.setId(propertyDiscountId);
                propertyDiscountRepository.save(propertyDiscount);
            }



            return new CustomResult(200, "Success", discount);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }
}
