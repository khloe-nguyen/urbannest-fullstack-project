package com.service.main.service.admin;

import com.service.main.dto.*;
import com.service.main.entity.Booking;
import com.service.main.repository.AdminRepository;
import com.service.main.repository.BookingRepository;
import com.service.main.repository.RoleRepository;
import com.service.main.service.PagingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class BookingADService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PagingService pagingService;


    public CustomPaging getBookingList(String email,
                                       int pageNumber,
                                       int pageSize,
                                       String hostSearch,
                                       String customerSearch,
                                       String bookingType,
                                       String startDate,
                                       String endDate,
                                       List<Integer> locationIds,
                                       String status,
                                       String propertySearch,
                                       List<Integer> refundIds
    ) {
        try {

            var employee = adminRepository.findByEmail(email);

            if (employee == null) {
                var customPaging = new CustomPaging();
                customPaging.setMessage("Employee not found");
                customPaging.setStatus(403);
                return customPaging;
            }

            boolean isAdmin = false;

            for (var empRole : employee.getAdminRoles()) {
                var role = roleRepository.findById(empRole.getRole().getId());

                if (role.get().getRoleName().equals("ADMIN")) {
                    isAdmin = true;
                    break;
                }
            }

            List<Integer> employeeManagedCity = employee.getAdminManageCities().stream().map(city -> city.getManagedCity().getId()).toList();

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("updatedAt").descending());

            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");

            Date start = sf.parse(startDate);
            Date end = sf.parse(endDate);


            Integer propertyIdSearch = null;
            String propertyNameSearch = null;

            if(propertySearch != null) {
                try{
                    propertyIdSearch = Integer.parseInt(propertySearch);
                }catch (Exception e){
                    propertyNameSearch = propertySearch;
                }

            }else{
                propertyNameSearch = propertySearch;
            }



            var bookingList = bookingRepository.getAdminBookingList(
                    isAdmin,
                    employeeManagedCity,
                    status,
                    hostSearch,
                    customerSearch,
                    bookingType,
                    start,
                    end,
                    locationIds,
                    propertyNameSearch,
                    propertyIdSearch,
                    refundIds,
                    pageable
            );

            List<BookingMinimizeDto> list = bookingList.getContent().stream().map((booking) -> {
                return convertToMinimizeDto(booking);
            }).toList();

            Page<BookingMinimizeDto> updatedPage = new PageImpl<>(list, pageable, bookingList.getTotalElements());

            return pagingService.convertToCustomPaging(updatedPage, pageNumber, pageSize);


        } catch (Exception e) {
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
