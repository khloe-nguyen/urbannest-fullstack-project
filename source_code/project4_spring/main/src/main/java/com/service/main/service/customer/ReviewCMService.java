package com.service.main.service.customer;

import com.service.main.dto.*;
import com.service.main.entity.Booking;
import com.service.main.entity.Review;
import com.service.main.repository.BookingRepository;
import com.service.main.repository.ReviewRepository;
import com.service.main.repository.UserRepository;
import com.service.main.service.PagingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ReviewCMService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;


    @Autowired
    private PagingService pagingService;


    public CustomResult rateByHost(String email, RateByHostDto rateByHostDto){
        try{
            var user = userRepository.findUserByEmail(email);

            var booking = bookingRepository.findById(rateByHostDto.getBookingId());

            if(booking.isEmpty()){
                return new CustomResult(404, "Booking not found", null);
            }

            if(booking.get().getHostReview() != null){
                return new CustomResult(403, "This booking is already reviewed", null);
            }

            var newRating = new Review();
            newRating.setUser(user);
            newRating.setTotalScore(rateByHostDto.getTotalScore());
            newRating.setReview(rateByHostDto.getReview());
            newRating.setAccuracyScore(rateByHostDto.getAccuracyScore());
            newRating.setCheckinScore(rateByHostDto.getCheckinScore());
            newRating.setCleanlinessScore(rateByHostDto.getCleanlinessScore());
            newRating.setCommunicationScore(rateByHostDto.getCommunicationScore());
            newRating.setToUser(rateByHostDto.getToUser());
            newRating.setBooking(booking.get());

            reviewRepository.save(newRating);


            booking.get().setHostReview(newRating);

            bookingRepository.save(booking.get());

            return new CustomResult(200, "Success", null);
        }catch (Exception e){
            return new CustomResult(400, "Bad request", e.getMessage());
        }
    }

    public CustomResult rateByCustomer(String email, RateByUserDto rateByHostDto){
        try{
            var user = userRepository.findUserByEmail(email);

            var booking = bookingRepository.findById(rateByHostDto.getBookingId());

            if(booking.isEmpty()){
                return new CustomResult(404, "Booking not found", null);
            }

            if(booking.get().getUserReview() != null){
                return new CustomResult(403, "This booking is already reviewed", null);
            }

            var newRating = new Review();
            newRating.setUser(user);
            newRating.setTotalScore(rateByHostDto.getTotalScore());
            newRating.setReview(rateByHostDto.getReview());
            newRating.setAccuracyScore(rateByHostDto.getAccuracyScore());
            newRating.setCheckinScore(rateByHostDto.getCheckinScore());
            newRating.setCleanlinessScore(rateByHostDto.getCleanlinessScore());
            newRating.setCommunicationScore(rateByHostDto.getCommunicationScore());
            newRating.setToUser(rateByHostDto.getToUser());
            newRating.setBooking(booking.get());

            reviewRepository.save(newRating);


            booking.get().setUserReview(newRating);

            bookingRepository.save(booking.get());

            return new CustomResult(200, "Success", null);
        }catch (Exception e){
            return new CustomResult(400, "Bad request", e.getMessage());
        }
    }


    public CustomPaging getPropertyReview(
            String email,
            int propertyId,
            int pageNumber,
            int pageSize,
            String status
    ){
        try{

            var user = userRepository.findUserByEmail(email);

            if(user == null){
                var customPaging = new CustomPaging();
                customPaging.setStatus(404);
                customPaging.setMessage("Not found");
                return customPaging;
            }

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());

            if(status.equals("own")){
                var reviews = reviewRepository.getPropertyHostReview(user.getId(),propertyId, pageable);

                var customPaging =  pagingService.convertToCustomPaging(reviews, pageNumber, pageSize);

                List<ReviewDto> reviewDtos = new ArrayList<>();

                for(var review: (List<Review>) customPaging.getData()){
                    var reviewDto = new ReviewDto();
                    BeanUtils.copyProperties(review, reviewDto);
                    var userDto = new UserAuthDto();
                    BeanUtils.copyProperties(user, userDto);
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

            if(status.equals("other")){
                var reviews = reviewRepository.getPropertyCustomerReview(user.getId(),propertyId, pageable);

                var customPaging =  pagingService.convertToCustomPaging(reviews, pageNumber, pageSize);

                List<ReviewDto> reviewDtos = new ArrayList<>();

                for(var review: (List<Review>) customPaging.getData()){
                    var reviewDto = new ReviewDto();
                    BeanUtils.copyProperties(review, reviewDto);
                    var userDto = new UserAuthDto();
                    BeanUtils.copyProperties(user, userDto);
                    reviewDto.setToUser(userDto);
                    var hostDto =new UserAuthDto();
                    BeanUtils.copyProperties(userRepository.findUserById(review.getUser().getId()), hostDto);
                    reviewDto.setUser(hostDto);

                    var bookingDto = new BookingMinimizeDto();
                    bookingDto = convertToMinimizeDto(review.getBooking());
                    reviewDto.setBooking(bookingDto);

                    reviewDtos.add(reviewDto);
                }

                customPaging.setData(reviewDtos);

                return customPaging;
            }

            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage("wrong status");
            return customPaging;

        }catch (Exception e){
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(e.getMessage());
            return customPaging;
        }
    }

    public CustomPaging getUserReview(
            String email,
            int pageNumber,
            int pageSize,
            String status
            ){
        try{
            var user = userRepository.findUserByEmail(email);

            if(user == null){
                var customPaging = new CustomPaging();
                customPaging.setStatus(404);
                customPaging.setMessage("Not found");
                return customPaging;
            }


            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());

            if(status.equals("own")){
                var reviews = reviewRepository.getUserOwnReview(user.getId(), pageable);

                var customPaging =  pagingService.convertToCustomPaging(reviews, pageNumber, pageSize);

                List<ReviewDto> reviewDtos = new ArrayList<>();

                for(var review: (List<Review>) customPaging.getData()){
                    var reviewDto = new ReviewDto();
                    BeanUtils.copyProperties(review, reviewDto);
                    var userDto = new UserAuthDto();
                    BeanUtils.copyProperties(user, userDto);
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

            if(status.equals("other")){
                var reviews = reviewRepository.getUserReviewedByOther(user.getId(), pageable);

                var customPaging =  pagingService.convertToCustomPaging(reviews, pageNumber, pageSize);

                List<ReviewDto> reviewDtos = new ArrayList<>();

                for(var review: (List<Review>) customPaging.getData()){
                    var reviewDto = new ReviewDto();
                    BeanUtils.copyProperties(review, reviewDto);
                    var userDto = new UserAuthDto();
                    BeanUtils.copyProperties(user, userDto);
                    reviewDto.setToUser(userDto);
                    var hostDto =new UserAuthDto();
                    BeanUtils.copyProperties(userRepository.findUserById(review.getUser().getId()), hostDto);
                    reviewDto.setUser(hostDto);

                    var bookingDto = new BookingMinimizeDto();
                    bookingDto = convertToMinimizeDto(review.getBooking());
                    reviewDto.setBooking(bookingDto);

                    reviewDtos.add(reviewDto);
                }

                customPaging.setData(reviewDtos);

                return customPaging;
            }

            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage("wrong status");
            return customPaging;

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


    public CustomResult getListReviewOfProperty(int propertyId) {
        var count = reviewRepository.countReviewsByPropertyId(propertyId);
        return new CustomResult(200, "Success", count);
    };

    public CustomPaging getListReviewOfProperty(int propertyId, int pageNumber, int pageSize) {


        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
        var reviewPage = reviewRepository.getUserReviewedByProperty(propertyId, pageable);
        var customPaging = pagingService.convertToCustomPaging(reviewPage, pageNumber, pageSize);


        List<ReviewResponseDto> reviewResponseDtoList = new ArrayList<>();


        for (var review : (List<Review>) customPaging.getData()) {
            var reviewDto = new ReviewResponseDto();
            BeanUtils.copyProperties(review, reviewDto);
            var userAuth = new UserAuthDto();
            BeanUtils.copyProperties(review.getUser(), userAuth);
            reviewDto.setUser(userAuth);
            reviewResponseDtoList.add(reviewDto);
        }
        customPaging.setData(reviewResponseDtoList);

        return customPaging;

    }



}
