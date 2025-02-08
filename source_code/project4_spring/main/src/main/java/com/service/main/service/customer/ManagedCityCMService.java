package com.service.main.service.customer;

import com.service.main.dto.CustomResult;
import com.service.main.dto.ManagedCityDto;
import com.service.main.repository.ManagedCityRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagedCityCMService {

    @Autowired
    private ManagedCityRepository managedCityRepository;


    public CustomResult getManagedCity(){
        try{
            var managedCities = managedCityRepository.findManagedCity();

            List<ManagedCityDto> list = managedCities.stream().map(managedCity -> {
                var managedCityDto = new ManagedCityDto();
                BeanUtils.copyProperties(managedCity, managedCityDto);
                return managedCityDto;
            }).toList();

            return new CustomResult(200, "Success", list);

        }catch (Exception e){
            return new CustomResult(400, "Bad request", null);
        }
    }



}
