package com.service.main.service.customer;

import com.service.main.dto.AmenityDto;
import com.service.main.dto.CustomResult;
import com.service.main.repository.AmenityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AmenityCMService {


    @Autowired
    private AmenityRepository amenityRepository;


    public CustomResult getPublicAmenities(){
        try{
            var amenities = amenityRepository.getPublicAmenities();

            var amenitiesDto = amenities.stream().map(amenity -> {
                var amenityDto = new AmenityDto();
                amenityDto.setId(amenity.getId());
                amenityDto.setName(amenity.getName());
                amenityDto.setDescription(amenity.getDescription());
                amenityDto.setType(amenity.getType());
                amenityDto.setStatus(amenity.isStatus());
                amenityDto.setImage(amenity.getImage());
                return amenityDto;
            }).toList();

            return new CustomResult(200, "Success", amenitiesDto);
        }catch (Exception ex){
            return new CustomResult(400, "Bad request", null);

        }
    }
}
