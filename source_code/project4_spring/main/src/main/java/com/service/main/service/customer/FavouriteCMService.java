package com.service.main.service.customer;

import com.service.main.dto.*;
import com.service.main.entity.Favourite;
import com.service.main.entity.FavouriteId;
import com.service.main.entity.Property;
import com.service.main.repository.FavouriteRepository;
import com.service.main.repository.PropertyRepository;
import com.service.main.repository.UserRepository;
import feign.Param;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class FavouriteCMService {
    @Autowired
    public FavouriteRepository favouriteRepository;

    @Autowired
    public PropertyRepository propertyRepository;

    @Autowired
    public UserRepository userRepository;


    public CustomResult deleteFavourite(FavouriteIDDto favouriteIDDto) {
        try {
            FavouriteId favouriteId = new FavouriteId();
            favouriteId.setUserId(favouriteIDDto.getUserId());
            favouriteId.setPropertyId(favouriteIDDto.getPropertyId());

            var exist = favouriteRepository.existsById(favouriteId);
            if (exist) {
                var favourite = favouriteRepository.findFavouriteById(favouriteId);
                favouriteRepository.delete(favourite);
                return new CustomResult(204, "Delete Success", null);
            } else {
                return new CustomResult(201, "Not Found To Delete", null);
            }
        } catch (Exception ex) {
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult createFavourite(FavouriteDto favouriteDto) {
        try {
            var favourite = new Favourite();
            // Create FavouriteId instance
            FavouriteId favouriteId = new FavouriteId();

            BeanUtils.copyProperties(favouriteDto, favourite);

            // Set userId and propertyId in FavouriteId
            if (favouriteDto.getUserId() != null) {
                var user = userRepository.findById(favouriteDto.getUserId());
                if (user.isPresent()) {
                    favourite.setUser(user.get());
                    favouriteId.setUserId(favouriteDto.getUserId());
                } else {
                    return new CustomResult(404, "User not found", null);
                }
            }

            if (favouriteDto.getPropertyId() != null) {
                var property = propertyRepository.findById(favouriteDto.getPropertyId());
                if (property.isPresent()) {
                    favourite.setProperty(property.get());
                    favouriteId.setPropertyId(favouriteDto.getPropertyId());
                } else {
                    return new CustomResult(404, "Property not found", null);
                }
            }

            // Set the id in Favourite
            favourite.setId(favouriteId);

            // Save the favourite
            favouriteRepository.save(favourite);
            return new CustomResult(200, "Success", favouriteDto);
        } catch (Exception ex) {
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult getAllFavouritesByUserId(@Param("userId") Integer userId) {
        try {
            var favourites = favouriteRepository.getAllFavouriteByUserId(userId);

            //map trả về 1 list FavouriteResponseDto
            List<FavouriteReponseDto> responseFavDto = favourites.stream().map(favourite -> {
                var favouriteReponseDto = new FavouriteReponseDto();
                favouriteReponseDto.setPropertyId(favourite.getProperty().getId());
                favouriteReponseDto.setPropertyImage(favourite.getProperty().getPropertyImages().get(0).getImageName());
                favouriteReponseDto.setPropertyName(favourite.getProperty().getPropertyTitle());
                favouriteReponseDto.setCollectionName(favourite.getCollectionName());

                return favouriteReponseDto;
            }).toList();

            return new CustomResult(200, "Success", responseFavDto);
        } catch (Exception ex) {
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult getFavouritesByUserIdAndCollectionName(String email, @Param("collectionName") String collectionName) {
        try {
            var user = userRepository.findUserByEmail(email);
            var favourites = favouriteRepository.findByUserIdAndCollectionName(user.getId(), collectionName);

            List<PropertyHomePageDto> propertyHomePageDtoList = favourites.stream().map(favourite -> {
                Property property = propertyRepository.findPropertyById(favourite.getProperty().getId());
                PropertyHomePageDto propertyHomePageDto = new PropertyHomePageDto();
                BeanUtils.copyProperties(property, propertyHomePageDto);

                double totalStar = 0;
                double totalStarScore = 0;

                for (var booking : property.getBookings()) {
                    if (booking.getUserReview() != null) {
                        totalStar++;
                        totalStarScore += booking.getUserReview().getTotalScore();
                    }
                }
                propertyHomePageDto.setAverageRating(totalStar > 0 ? totalStarScore / totalStar : 0);

                List<String> images = property.getPropertyImages().stream()
                        .map(image -> image.getImageName())
                        .toList();
                propertyHomePageDto.setPropertyImages(images);

                return propertyHomePageDto;
            }).toList();

            return new CustomResult(200, "Success", propertyHomePageDtoList);
        } catch (NoSuchElementException ex) {
            return new CustomResult(404, "User or favourites not found", ex.getMessage());
        } catch (Exception ex) {
            return new CustomResult(400, "Bad request", ex.getMessage());
        }


    }
}
