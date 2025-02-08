package com.service.main.service.admin;

import com.service.main.dto.*;
import com.service.main.entity.Booking;
import com.service.main.entity.BookingDispute;
import com.service.main.entity.BookingDisputeDetail;
import com.service.main.repository.*;
import com.service.main.service.ImageUploadingService;
import com.service.main.service.PagingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisputeADService {

    @Autowired
    private BookingDisputeRepository bookingDisputeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PagingService pagingService;

    @Autowired
    private ImageUploadingService imageUploadingService;

    @Autowired
    private BookingDisputeDetailRepository bookingDisputeDetailRepository;

    public CustomPaging getDisputeList(String email,
                                       int pageNumber,
                                       int pageSize,
                                       String hostSearch,
                                       String customerSearch,
                                       List<Integer> locationIds,
                                       String status,
                                       String propertySearch){
        try{
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

            Integer propertyIdSearch = null;
            String propertyNameSearch = null;

            if(propertySearch != null) {
                try{
                    propertyIdSearch = Integer.parseInt(propertySearch);
                }catch (Exception e){
                    propertyNameSearch = propertySearch;
                }
            }

            var disputeSearch = bookingDisputeRepository.getDisputeList(
                    isAdmin,
                    employeeManagedCity,
                    status,
                    hostSearch,
                    customerSearch,
                    locationIds,
                    propertyNameSearch,
                    propertyIdSearch,
                    pageable
            );

            var customPaging = pagingService.convertToCustomPaging(disputeSearch, pageNumber, pageSize);

            List<DisputeReponseDto> disputeReponseDtoList = new ArrayList<>();

            for(var dispute: (List<BookingDispute>) customPaging.getData()){
                DisputeReponseDto disputeReponseDto = new DisputeReponseDto();
                BeanUtils.copyProperties(dispute, disputeReponseDto);
                var bookingMinimizeDto = convertToMinimizeDto(dispute.getBooking());
                disputeReponseDto.setBooking(bookingMinimizeDto);
                    disputeReponseDtoList.add(disputeReponseDto);
            }

            customPaging.setData(disputeReponseDtoList);

            return customPaging;
        }catch (Exception e){
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(e.getMessage());
            return customPaging;
        }
    }

    public CustomResult changeDisputeStatus(ChangeDisputeStatusDto changeDisputeStatusDto){
        try{
            var bookingDispute = bookingDisputeRepository.findById(changeDisputeStatusDto.getDisputeId());

            if (bookingDispute.isEmpty()) {
                return new CustomResult(404, "Not found", null);
            }

            bookingDispute.get().setStatus(changeDisputeStatusDto.getStatus());
            bookingDispute.get().setResolution(changeDisputeStatusDto.getResolution());

            if(changeDisputeStatusDto.getStatus().equals("IGNORE")){
                bookingDispute.get().getBooking().setStatus("ACCEPT");
                bookingRepository.save(bookingDispute.get().getBooking());
            }
            bookingDispute.get().setUpdatedAt(new Date());

            if(changeDisputeStatusDto.getStatus().equals("PROGRESS")){
                bookingDispute.get().setAcceptedAt(new Date());
            }


            bookingDisputeRepository.save(bookingDispute.get());

            return new CustomResult(200, "OK", null);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }

    public CustomResult addMoreDetail(String email, BookingDisputeDetailRequestDto bookingDisputeDetailRequestDto){
        try{
            var employee = adminRepository.findByEmail(email);

            if(employee == null) {
                return new CustomResult(404, "Employee not found", null);
            }

            var dispute = bookingDisputeRepository.findById(bookingDisputeDetailRequestDto.getId());

            if(dispute.isEmpty()) {
                return new CustomResult(404, "Dispute not found", null);
            }

            var newDetail = new BookingDisputeDetail();
            newDetail.setBookingDispute(dispute.get());
            newDetail.setCreatedAt(new Date());
            newDetail.setCustomerReason(bookingDisputeDetailRequestDto.getCustomerReason());
            newDetail.setCustomerImages(String.join(",",
                    bookingDisputeDetailRequestDto.getCustomerImages().stream().map(
                            multipartFile -> imageUploadingService.upload(multipartFile) )
                            .toList()));
            newDetail.setAdmin(employee);
            newDetail.setAdminNote(bookingDisputeDetailRequestDto.getAdminNote());
            newDetail.setHostReason(bookingDisputeDetailRequestDto.getHostReason());
            newDetail.setHostImages(String.join(",",
                    bookingDisputeDetailRequestDto.getHostImages().stream().map(
                                    multipartFile -> imageUploadingService.upload(multipartFile) )
                            .toList()));

            bookingDisputeDetailRepository.save(newDetail);

            return new CustomResult(200, "OK", null);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }

    public CustomResult getDisputeDetail(int disputeId){
        try{
            var dispute = bookingDisputeRepository.findById(disputeId);

            if(dispute.isEmpty()) {
                return new CustomResult(404, "Not found", null);
            }

            DisputeReponseDto disputeReponseDto = new DisputeReponseDto();
            BeanUtils.copyProperties(dispute.get(), disputeReponseDto);
            var bookingMinimizeDto = convertToMinimizeDto(dispute.get().getBooking());
            disputeReponseDto.setBooking(bookingMinimizeDto);

            List<BookingDisputeDetailResponseDto> bookingDisputeDetailResponseDtoList = new ArrayList<>();

            for(var disputeDetail : dispute.get().getBookingDisputeDetails()){
                var disputeDetailResponseDto = new BookingDisputeDetailResponseDto();
                BeanUtils.copyProperties(disputeDetail, disputeDetailResponseDto);

                var adminDto = new AdminDto();
                BeanUtils.copyProperties(disputeDetail.getAdmin(), adminDto);
                disputeDetailResponseDto.setAdmin(adminDto);
                bookingDisputeDetailResponseDtoList.add(disputeDetailResponseDto);
            }

            disputeReponseDto.setBookingDisputeDetails(bookingDisputeDetailResponseDtoList);

            return new CustomResult(200, "Success", disputeReponseDto);
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
