package com.service.main.service.admin;

import com.service.main.dto.*;
import com.service.main.entity.Booking;
import com.service.main.repository.BookingRepository;
import com.service.main.repository.PropertyRepository;
import com.service.main.repository.TransactionRepository;
import com.service.main.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ChartADService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository  transactionRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public CustomResult getCountChartDashBoard(String start, String end){
        try{
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = sdf.parse(start);
            Date endDate = sdf.parse(end);

            var earning = transactionRepository.findEarning(startDate, endDate);

            var totalBooking = bookingRepository.findTotalBooking(startDate, endDate);

            var customerList = userRepository.findAll();

            var totalCustomer = customerList.size();

            var properties = propertyRepository.findAll();

            var totalProperties = properties.size();

            var newDashboardChartDto = new DashboardCountDto();
            newDashboardChartDto.setBookings(totalBooking);
            newDashboardChartDto.setCustomers(totalCustomer);
            newDashboardChartDto.setProperties(totalProperties);
            newDashboardChartDto.setTotalEarning(earning);
            return new CustomResult(200, "Success", newDashboardChartDto);



        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }


    public CustomResult getBookingBasedOnDate(String startDate, String endDate){
        try{
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            Date start = sdf.parse(startDate);
            Date end = sdf.parse(endDate);

            var transactionList = transactionRepository.findRevenue(start, end);


            return new CustomResult(200, "Success", transactionList);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }

    public CustomResult getBestHost(){
        try{
            var bestHostList = userRepository.findBestHost();

            List<BestHostDto> bestHostDtoList = new ArrayList<>();

            for(var user : bestHostList){
                BestHostDto bestHostDto = new BestHostDto();
                BeanUtils.copyProperties(user, bestHostDto);
                var bestPropertyOfHost = propertyRepository.findBestPropertyOfHost(user.getId());

                PropertyHomePageDto propertyHomePageDto = new PropertyHomePageDto();

                BeanUtils.copyProperties(bestPropertyOfHost, propertyHomePageDto);
                double totalStar = 0;
                double totalStarScore = 0;
                double revenue= 0;

                for(var booking : bestPropertyOfHost.getBookings()){
                    if(booking.getUserReview() != null){
                        totalStar = totalStar + 1;
                        totalStarScore = totalStarScore + booking.getUserReview().getTotalScore();
                    }

                    if(booking.getTransactions().size() > 1){
                        revenue = revenue + booking.getWebsiteFee();
                    }
                }

                propertyHomePageDto.setAverageRating(totalStarScore / totalStar);


                List<String> images = new ArrayList<>();

                for(var image : bestPropertyOfHost.getPropertyImages()) {
                    images.add(image.getImageName());
                }

                propertyHomePageDto.setPropertyImages(images);

                bestHostDto.setBestProperty(propertyHomePageDto);
                bestHostDtoList.add(bestHostDto);
                bestHostDto.setRevenue(revenue);
            }

            return new CustomResult(200, "Success", bestHostDtoList);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
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
