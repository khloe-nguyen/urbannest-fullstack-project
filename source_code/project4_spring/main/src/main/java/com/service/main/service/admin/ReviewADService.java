package com.service.main.service.admin;

import com.service.main.dto.*;
import com.service.main.entity.Booking;
import com.service.main.entity.Review;
import com.service.main.repository.PropertyRepository;
import com.service.main.repository.ReviewRepository;
import com.service.main.repository.UserRepository;
import com.service.main.service.PagingService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewADService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PagingService pagingService;

    @Autowired
    private UserRepository userRepository;

    public CustomPaging getPropertyReview(  int propertyId,
                                            int pageNumber,
                                            int pageSize,
                                            String search,
                                            String status
    ){
        try{
            var property = propertyRepository.findById(propertyId);

            if(property.isEmpty()){
                var customPaging = new CustomPaging();
                customPaging.setStatus(400);
                customPaging.setMessage("Property not found");
                return customPaging;
            }

            if(status.equals("recent")){
                Pageable pageable = pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());

                var reviews = reviewRepository.getPropertyAdminCustomerReview(property.get().getUser().getId(),propertyId, search, pageable);

                var customPaging =  pagingService.convertToCustomPaging(reviews, pageNumber, pageSize);

                List<ReviewDto> reviewDtos = new ArrayList<>();

                for(var review: (List<Review>) customPaging.getData()){
                    var reviewDto = new ReviewDto();
                    BeanUtils.copyProperties(review, reviewDto);
                    var userDto = new UserAuthDto();
                    BeanUtils.copyProperties(review.getUser(), userDto);
                    reviewDto.setUser(userDto);
                    var hostDto =new UserAuthDto();
                    BeanUtils.copyProperties(userRepository.findUserById(review.getToUser()), hostDto);
                    reviewDto.setToUser(hostDto);

                    var bookingDto = new BookingMinimizeDto();
                    bookingDto = convertToMinimizeDto(review.getBooking());
                    reviewDto.setBooking(bookingDto);

                    reviewDtos.add(reviewDto);
                }

                customPaging.setData(reviewDtos);

                return customPaging;
            }

            if(status.equals("highest")){
                Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("totalScore").descending());

                var reviews = reviewRepository.getPropertyAdminCustomerReview(property.get().getUser().getId(),propertyId, search, pageable);

                var customPaging =  pagingService.convertToCustomPaging(reviews, pageNumber, pageSize);

                List<ReviewDto> reviewDtos = new ArrayList<>();

                for(var review: (List<Review>) customPaging.getData()){
                    var reviewDto = new ReviewDto();
                    BeanUtils.copyProperties(review, reviewDto);
                    var userDto = new UserAuthDto();
                    BeanUtils.copyProperties(review.getUser(), userDto);
                    reviewDto.setUser(userDto);
                    var hostDto =new UserAuthDto();
                    BeanUtils.copyProperties(userRepository.findUserById(review.getToUser()), hostDto);
                    reviewDto.setToUser(hostDto);

                    var bookingDto = new BookingMinimizeDto();
                    bookingDto = convertToMinimizeDto(review.getBooking());
                    reviewDto.setBooking(bookingDto);

                    reviewDtos.add(reviewDto);
                }

                customPaging.setData(reviewDtos);

                return customPaging;
            }

            if(status.equals("lowest")){
                Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("totalScore").ascending());

                var reviews = reviewRepository.getPropertyAdminCustomerReview(property.get().getUser().getId(),propertyId, search, pageable);

                var customPaging =  pagingService.convertToCustomPaging(reviews, pageNumber, pageSize);

                List<ReviewDto> reviewDtos = new ArrayList<>();

                for(var review: (List<Review>) customPaging.getData()){
                    var reviewDto = new ReviewDto();
                    BeanUtils.copyProperties(review, reviewDto);
                    var userDto = new UserAuthDto();
                    BeanUtils.copyProperties(review.getUser(), userDto);
                    reviewDto.setUser(userDto);
                    var hostDto =new UserAuthDto();
                    BeanUtils.copyProperties(userRepository.findUserById(review.getToUser()), hostDto);
                    reviewDto.setToUser(hostDto);

                    var bookingDto = new BookingMinimizeDto();
                    bookingDto = convertToMinimizeDto(review.getBooking());
                    reviewDto.setBooking(bookingDto);

                    reviewDtos.add(reviewDto);
                }

                customPaging.setData(reviewDtos);

                return customPaging;
            }

            return new CustomPaging();
        }catch (Exception e){
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(e.getMessage());
            return customPaging;
        }
    }

    BookingMinimizeDto convertToMinimizeDto(Booking bookingDto){
        var bookingMinimizeDto = new BookingMinimizeDto();
        BeanUtils.copyProperties(bookingDto, bookingMinimizeDto);

        PropertyMinimizeDto propertyMinimizeDto = new PropertyMinimizeDto();
        BeanUtils.copyProperties(bookingDto.getProperty(), propertyMinimizeDto);

        var managedCityDto = new ManagedCityDto();
        BeanUtils.copyProperties(bookingDto.getProperty().getManagedCity(), managedCityDto);
        propertyMinimizeDto.setManagedCity(managedCityDto);

        var refundDto = new RefundDto();
        BeanUtils.copyProperties(bookingDto.getRefundPolicy(), refundDto);
        propertyMinimizeDto.setRefundPolicy(refundDto);

        var userAuthDto = new UserAuthDto();
        BeanUtils.copyProperties(bookingDto.getHost(), userAuthDto);
        propertyMinimizeDto.setUser(userAuthDto);

        var categoryDto = new CategoryDto();
        BeanUtils.copyProperties(bookingDto.getProperty().getPropertyCategory(), categoryDto);
        propertyMinimizeDto.setPropertyCategory(categoryDto);

        if(bookingDto.getProperty().getInstantBookRequirement() != null){
            var badgeDto = new BadgeDto();
            BeanUtils.copyProperties(bookingDto.getProperty().getInstantBookRequirement(), badgeDto);
            propertyMinimizeDto.setInstantBookRequirement(badgeDto);

        }


        List<String> images = new ArrayList<>();
        for(var image : bookingDto.getProperty().getPropertyImages()){
            images.add(image.getImageName());
        }
        propertyMinimizeDto.setPropertyImages(images);

        var propertyNotAvailableDateDtoList = new ArrayList<PropertyNotAvailableDateDto>();
        bookingDto.getProperty().getPropertyNotAvailableDates().forEach(propertyNotAvailableDateDto -> {
            PropertyNotAvailableDateDto propertyNotAvailableDate = new PropertyNotAvailableDateDto();
            BeanUtils.copyProperties(propertyNotAvailableDateDto, propertyNotAvailableDate);
            propertyNotAvailableDateDtoList.add(propertyNotAvailableDate);
        });
        propertyMinimizeDto.setPropertyNotAvailableDates(propertyNotAvailableDateDtoList);


        var propertyExceptionDateDtoArrayList = new ArrayList<PropertyExceptionDateDto>();
        bookingDto.getProperty().getPropertyExceptionDates().forEach(propertyExceptionDate -> {
            PropertyExceptionDateDto propertyNotAvailableDateDto = new PropertyExceptionDateDto();
            BeanUtils.copyProperties(propertyExceptionDate, propertyNotAvailableDateDto);
            propertyExceptionDateDtoArrayList.add(propertyNotAvailableDateDto);
        });
        propertyMinimizeDto.setPropertyExceptionDates(propertyExceptionDateDtoArrayList);


        var amenityList = new ArrayList<AmenityDto>();
        bookingDto.getProperty().getPropertyAmenities().forEach(propertyAmenity -> {
            AmenityDto amenityDto = new AmenityDto();
            BeanUtils.copyProperties(propertyAmenity.getAmenity(), amenityDto);
            amenityList.add(amenityDto);
        });
        propertyMinimizeDto.setPropertyAmenities(amenityList);

        bookingMinimizeDto.setProperty(propertyMinimizeDto);
        bookingMinimizeDto.setRefundPolicy(refundDto);


        if(bookingDto.getHostReview() != null){
            var hostReview = new ReviewMinimizeDto();
            BeanUtils.copyProperties(bookingDto.getHost(), hostReview);
            var userDto = new UserDto();
            BeanUtils.copyProperties(bookingDto.getHost(), userDto);
            hostReview.setUser(userDto);
            bookingMinimizeDto.setHostReview(hostReview);
        }

        if(bookingDto.getUserReview() != null){
            var userReview = new ReviewMinimizeDto();
            BeanUtils.copyProperties(bookingDto.getHost(), userReview);
            var userDto = new UserDto();
            BeanUtils.copyProperties(bookingDto.getCustomer(), userDto);
            userReview.setUser(userDto);
            bookingMinimizeDto.setUserReview(userReview);
        }

        var customerDto = new UserDto();
        BeanUtils.copyProperties(bookingDto.getCustomer(), customerDto);
        bookingMinimizeDto.setCustomer(customerDto);

        var hostDto = new UserDto();
        BeanUtils.copyProperties(bookingDto.getHost(), hostDto);
        bookingMinimizeDto.setHost(hostDto);


        List<TransactionMinimizeDto> listTransactionMinimizeDto = new ArrayList<>();

        bookingDto.getTransactions().forEach(transaction -> {
            TransactionMinimizeDto transactionMinimizeDto = new TransactionMinimizeDto();
            BeanUtils.copyProperties(transaction, transactionMinimizeDto);
            listTransactionMinimizeDto.add(transactionMinimizeDto);
        });

        bookingMinimizeDto.setTransactions(listTransactionMinimizeDto);

        List<BookDateDetailDto> bookingDateDtoList = new ArrayList<>();

        bookingDto.getBookDateDetails().forEach(bookingDate -> {
            BookDateDetailDto bookingDateDto = new BookDateDetailDto();
            BeanUtils.copyProperties(bookingDate, bookingDateDto);
            bookingDateDtoList.add(bookingDateDto);
        });
        bookingMinimizeDto.setBookDateDetails(bookingDateDtoList);

        return bookingMinimizeDto;
    }


}
