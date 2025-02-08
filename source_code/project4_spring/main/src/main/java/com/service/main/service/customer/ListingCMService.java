package com.service.main.service.customer;

import com.google.type.DateTime;
import com.service.main.dto.*;
import com.service.main.entity.*;
import com.service.main.repository.*;
import com.service.main.service.FirebaseRealTimeService;
import com.service.main.service.ImageUploadingService;
import com.service.main.service.PagingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ListingCMService {


    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ManagedCityRepository managedCityRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private PropertyAmenityRepository propertyAmenityRepository;

    @Autowired
    private ImageUploadingService imageUploadingService;

    @Autowired
    private RefundPolicyRepository refundPolicyRepository;

    @Autowired
    private PropertyCategoryRepository propertyCategoryRepository;

    @Autowired
    private PropertyImageRepository propertyImageRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private PagingService pagingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PropertyExceptionDateRepository propertyExceptionDateRepository;

    @Autowired
    private PropertyNotAvailableDateRepository propertyNotAvailableDateRepository;

    @Autowired
    private NotificationAdminRepository notificationAdminRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private FirebaseRealTimeService firebaseRealTimeService;

    //update notification
    public CustomResult pendingRequest(int propertyId){
        try{
            var property = propertyRepository.findById(propertyId);

            if(property.isEmpty()){
                return new CustomResult(404, "Not found", null);
            }

            var employees = adminRepository.findAdminAndSpecificRole("PROPERTY_MANAGEMENT");

            for(var employee : employees){
                var listManagedCity = employee.getAdminManageCities().stream().map(AdminManageCity::getManagedCity).toList();

                boolean isAdmin = false;

                for(var empRole : employee.getAdminRoles()){
                    var role = roleRepository.findById(empRole.getRole().getId());

                    if(role.get().getRoleName().equals("ADMIN")){
                        isAdmin = true;
                        break;
                    }
                }

                if(listManagedCity.contains(property.get().getManagedCity()) || isAdmin){
                    var newAdminNotification = new NotificationAdmin();
                    newAdminNotification.setMessage(String.format("Property with name %s of host %s is waiting for your review", property.get().getPropertyTitle(),property.get().getUser().getFirstName() + " " + property.get().getPropertyTitle(),property.get().getUser().getLastName() ));
                    newAdminNotification.setAdmin(employee);
                    newAdminNotification.setCreatedAt(new Date());
                    newAdminNotification.setUrl(String.format("/admin/listing_list?property=%s", property.get().getId()));
                    newAdminNotification.setRead(false);
                    notificationAdminRepository.save(newAdminNotification);

                    var webKey = String.format("notification_%d_web", employee.getId());
                    var bodyMessage = new HashMap<String, String>();
                    bodyMessage.put("message", "Customer has request for public, see notification for more detail");
                    bodyMessage.put("web", "false");
                    bodyMessage.put("time", new Date().toString());
                    firebaseRealTimeService.writeData(webKey, bodyMessage);

                }
            }


            property.get().setStatus("PENDING");
            property.get().setSuggestion("");

            propertyRepository.save(property.get());
            return new CustomResult(200, "Success", null);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }


    public CustomResult initializeListing(String email){
        try{

            var user = userRepository.findUserByEmail(email);

            if(user == null){
                return new CustomResult(404, "User not found", null);
            }

            var newProperty = new Property();
            newProperty.setCreatedAt(new Date());
            newProperty.setUpdatedAt(new Date());
            newProperty.setStatus("PROGRESS");
            newProperty.setUser(user);
            propertyRepository.save(newProperty);
            return new CustomResult(200, "Success", newProperty.getId());
        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult getListing(String email, int id){
        try{
            var user = userRepository.findUserByEmail(email);
            if(user == null){
                return new CustomResult(404, "User not found", null);
            }

            var listing = propertyRepository.findByIdAndUserId(id, user.getId());

            if(listing == null){
                return new CustomResult(404, "Listing not found", null);
            }

            var propertyDto = new PropertyDto();

            BeanUtils.copyProperties(listing, propertyDto);
            if(listing.getManagedCity() != null){
                propertyDto.setManagedCityId(listing.getManagedCity().getId());
            }

            if(listing.getRefundPolicy() != null){
                propertyDto.setRefundPolicyId(listing.getRefundPolicy().getId());
            }

            propertyDto.setUserId(listing.getUser().getId());

            if(listing.getPropertyCategory() != null){
                propertyDto.setPropertyCategoryID(listing.getPropertyCategory().getId());
            }

            if(listing.getInstantBookRequirement() != null){
                propertyDto.setInstantBookRequirementID(listing.getInstantBookRequirement().getId());
            }

            List<Integer> amenityList = new ArrayList<>();

            for(var amenity : listing.getPropertyAmenities()){
                amenityList.add(amenity.getAmenity().getId());
            }
            propertyDto.setPropertyAmenities(amenityList);

            List<String> imageList = new ArrayList<>();

            for(var image : listing.getPropertyImages()){
                imageList.add(image.getImageName());
            }

            propertyDto.setPropertyImages(imageList);

            return new CustomResult(200, "Success", propertyDto);
        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }


    // notification
    @Transactional
    public CustomResult updateListing(PropertyDto propertyDto){
        try{
            var property = propertyRepository.findAllListingById(propertyDto.getId());

            BeanUtils.copyProperties(propertyDto, property);

            if(propertyDto.getManagedCityId() != null){
                var managedCity = managedCityRepository.findById(propertyDto.getManagedCityId());
                property.setManagedCity(managedCity.get());
            }

            if(propertyDto.getRefundPolicyId() != null){
                var refundPolicy = refundPolicyRepository.findById(propertyDto.getRefundPolicyId());
                property.setRefundPolicy(refundPolicy.get());
            }

            if(propertyDto.getPropertyCategoryID() != null){
                var propertyCategory = propertyCategoryRepository.findById(propertyDto.getPropertyCategoryID());
                property.setPropertyCategory(propertyCategory.get());
            }

            if(propertyDto.getInstantBookRequirementID() != null){
                var badge = badgeRepository.findById(propertyDto.getInstantBookRequirementID());
                property.setInstantBookRequirement(badge.get());
            }else{
                property.setInstantBookRequirement(null);
            }

            propertyImageRepository.deleteAllByPropertyId(property.getId());

            if(propertyDto.getPropertyImages() != null){
                for(var image: propertyDto.getPropertyImages()){
                    var newImage = new PropertyImage();
                    newImage.setImageName(image);
                    newImage.setProperty(property);
                    propertyImageRepository.save(newImage);

                }
            }

            if(propertyDto.getNewImages() != null){
                for(var obj: propertyDto.getNewImages()){
                    var image = imageUploadingService.upload(obj);
                    var newImage = new PropertyImage();
                    newImage.setImageName(image);
                    newImage.setProperty(property);
                    propertyImageRepository.save(newImage);
                }
            }

            // delete all amenity and then update new one
            propertyAmenityRepository.deleteAllByPropertyId(property.getId());


            if(propertyDto.getPropertyAmenities() != null){
                for(var amenityId: propertyDto.getPropertyAmenities()){
                    var amenity = amenityRepository.findById(amenityId);
                    var propertyAmenityId = new PropertyAmenityId(property.getId(), amenityId);
                    var newAmenity = new PropertyAmenity();
                    newAmenity.setId(propertyAmenityId);
                    newAmenity.setProperty(property);
                    newAmenity.setAmenity(amenity.get());
                    propertyAmenityRepository.save(newAmenity);
                }
            }



            property.setUpdatedAt(new Date());
            propertyRepository.save(property);

            if(property.getStatus().equals("PUBLIC")){
                var employees = adminRepository.findAdminAndSpecificRole("PROPERTY_MANAGEMENT");

                for(var employee : employees){
                    var listManagedCity = employee.getAdminManageCities().stream().map(AdminManageCity::getManagedCity).toList();

                    boolean isAdmin = false;

                    for(var empRole : employee.getAdminRoles()){
                        var role = roleRepository.findById(empRole.getRole().getId());

                        if(role.get().getRoleName().equals("ADMIN")){
                            isAdmin = true;
                            break;
                        }
                    }

                    if(listManagedCity.contains(property.getManagedCity()) || isAdmin){
                        var newAdminNotification = new NotificationAdmin();
                        newAdminNotification.setMessage(String.format("Property with name %s of host %s is updated please check for it valid", property.getPropertyTitle(),property.getUser().getFirstName() + " " + property.getPropertyTitle(),property.getUser().getLastName() ));
                        newAdminNotification.setAdmin(employee);
                        newAdminNotification.setCreatedAt(new Date());
                        newAdminNotification.setUrl(String.format("/admin/listing_list?property=%s", property.getId()));
                        newAdminNotification.setRead(false);
                        notificationAdminRepository.save(newAdminNotification);


                        var webKey = String.format("notification_%d_web", employee.getId());
                        var bodyMessage = new HashMap<String, String>();
                        bodyMessage.put("message", "Customer has updated their property, see notification for more detail");
                        bodyMessage.put("web", "false");
                        bodyMessage.put("time", new Date().toString());
                        firebaseRealTimeService.writeData(webKey, bodyMessage);
                    }
                }
            }






            return new CustomResult(200, "Success", null);
        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomPaging getHostListing(int pageNumber, int pageSize, String email, String search, String status){
        try{
            var user = userRepository.findUserByEmail(email);

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("updatedAt").descending());

            var listings = propertyRepository.findListingByUserId(user.getId(), search, status, pageable);

            var customPaging =  pagingService.convertToCustomPaging(listings, pageNumber, pageSize);

            List<PropertyMinimizeDto> propertyMinimizeDtos = new ArrayList<>();

            for(var property: (List<Property>) customPaging.getData()){
                propertyMinimizeDtos.add(convertFromPropertyToPropertyMinimize(property));
            }
            customPaging.setData(propertyMinimizeDtos);

            return customPaging;
        } catch (Exception e) {
            var customPaging = new CustomPaging();
            customPaging.setData(e.getMessage());
            customPaging.setStatus(400);
            return customPaging;
        }
    }

    public CustomResult openDate(int propertyId, String start, String end){
        try{
            var property = propertyRepository.findListingById(propertyId);

            if(property == null){
                return new CustomResult(404, "Property not found", null);
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(start);
            Date endDate = dateFormat.parse(end);

            var checkList = bookingRepository.checkIfBlockable(propertyId, startDate, endDate);

            if(!checkList.isEmpty()){
                return new CustomResult(403, "Some one already book that day", checkList);
            }

            Calendar calendar = Calendar.getInstance();

            calendar.setTime(startDate);

            while (!calendar.getTime().after(endDate)) {
                var checkExist = propertyNotAvailableDateRepository.findByPropertyIdAndDate(propertyId, calendar.getTime());

                if(checkExist != null){
                    propertyNotAvailableDateRepository.delete(checkExist);
                }

                calendar.add(Calendar.DATE, 1);
            }

            var webKey = String.format("property_%d_web", property.getId());
            var phoneKey = String.format("property_%d_phone", property.getId());
            var bodyMessage = new HashMap<String, String>();
            bodyMessage.put("message", "This property calendar has updated please refresh to updated new calendar");
            bodyMessage.put("time", new Date().toString());
            firebaseRealTimeService.writeData(webKey, bodyMessage);
            firebaseRealTimeService.writeData(phoneKey, bodyMessage);

            return new CustomResult(200, "Success", null);

        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult openDateMobile(int propertyId, List<String> dates){
        try{
            var property = propertyRepository.findListingById(propertyId);

            if(property == null){
                return new CustomResult(404, "Property not found", null);
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

            List<Date> listDates = new ArrayList<>();

            for(var date : dates){
                listDates.add(dateFormat.parse(date));
            }

            var checkList = bookingRepository.checkIfBlockableByDateDetail(propertyId, listDates);

            if(!checkList.isEmpty()){
                return new CustomResult(403, "Some one already book that day", checkList);
            }

            Calendar calendar = Calendar.getInstance();


            for(var openDate : listDates ){
                calendar.setTime(openDate);
                var checkExist = propertyNotAvailableDateRepository.findByPropertyIdAndDate(propertyId, calendar.getTime());

                if(checkExist != null){
                    propertyNotAvailableDateRepository.delete(checkExist);
                }
            }

            var webKey = String.format("property_%d_web", property.getId());
            var phoneKey = String.format("property_%d_phone", property.getId());
            var bodyMessage = new HashMap<String, String>();
            bodyMessage.put("message", "This property calendar has updated please refresh to updated new calendar");
            bodyMessage.put("time", new Date().toString());
            firebaseRealTimeService.writeData(webKey, bodyMessage);
            firebaseRealTimeService.writeData(phoneKey, bodyMessage);


            return new CustomResult(200, "Success", null);

        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult blockDate(int propertyId, String start, String end){
        try{
            var property = propertyRepository.findListingById(propertyId);

            if(property == null){
                return new CustomResult(404, "Property not found", null);
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(start);
            Date endDate = dateFormat.parse(end);

            var checkList = bookingRepository.checkIfBlockable(propertyId, startDate, endDate);

            if(!checkList.isEmpty()){
                return new CustomResult(403, "Some one already book that day", checkList);
            }

            Calendar calendar = Calendar.getInstance();

            calendar.setTime(startDate);

            while (!calendar.getTime().after(endDate)) {
                var checkExist = propertyNotAvailableDateRepository.findByPropertyIdAndDate(propertyId, calendar.getTime());

                if(checkExist == null){
                    PropertyNotAvailableDate newPropertyNotAvailableDate = new PropertyNotAvailableDate();
                    newPropertyNotAvailableDate.setDate(calendar.getTime());
                    newPropertyNotAvailableDate.setProperty(property);
                    propertyNotAvailableDateRepository.save(newPropertyNotAvailableDate);
                }

                calendar.add(Calendar.DATE, 1);
            }

            var webKey = String.format("property_%d_web", property.getId());
            var phoneKey = String.format("property_%d_phone", property.getId());
            var bodyMessage = new HashMap<String, String>();
            bodyMessage.put("message", "This property calendar has updated please refresh to updated new calendar");
            bodyMessage.put("time", new Date().toString());
            firebaseRealTimeService.writeData(webKey, bodyMessage);
            firebaseRealTimeService.writeData(phoneKey, bodyMessage);


            return new CustomResult(200, "Success", null);

        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult blockDateMobile(int propertyId, List<String> blockDates){
        try{
            var property = propertyRepository.findListingById(propertyId);

            if(property == null){
                return new CustomResult(404, "Property not found", null);
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

            List<Date> listBlockDates = new ArrayList<>();

            for(var date : blockDates){
                listBlockDates.add(dateFormat.parse(date));
            }

            var checkList = bookingRepository.checkIfBlockableByDateDetail(propertyId, listBlockDates);

            if(!checkList.isEmpty()){
                return new CustomResult(403, "Some one already book that day", checkList);
            }

            Calendar calendar = Calendar.getInstance();

            for(var blockDate : listBlockDates ){
                calendar.setTime(blockDate);
                var checkExist = propertyNotAvailableDateRepository.findByPropertyIdAndDate(propertyId, calendar.getTime());

                if(checkExist == null){
                    PropertyNotAvailableDate newPropertyNotAvailableDate = new PropertyNotAvailableDate();
                    newPropertyNotAvailableDate.setDate(calendar.getTime());
                    newPropertyNotAvailableDate.setProperty(property);
                    propertyNotAvailableDateRepository.save(newPropertyNotAvailableDate);
                }

            }

            var webKey = String.format("property_%d_web", property.getId());
            var phoneKey = String.format("property_%d_phone", property.getId());
            var bodyMessage = new HashMap<String, String>();
            bodyMessage.put("message", "This property calendar has updated please refresh to updated new calendar");
            bodyMessage.put("time", new Date().toString());
            firebaseRealTimeService.writeData(webKey, bodyMessage);
            firebaseRealTimeService.writeData(phoneKey, bodyMessage);


            return new CustomResult(200, "Success", null);

        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult changePriceForDatesMobile(int propertyId, List<String> dates, double price){
        try{
            var property = propertyRepository.findListingById(propertyId);

            if(property == null){
                return new CustomResult(404, "Property not found", null);
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

            List<Date> listDates = new ArrayList<>();

            for(var date : dates){
                listDates.add(dateFormat.parse(date));
            }

            var checkList = bookingRepository.checkIfBlockableByDateDetail(propertyId, listDates);

            if(!checkList.isEmpty()){
                return new CustomResult(403, "Some one already book that day", checkList);
            }

            Calendar calendar = Calendar.getInstance();

            for(var date : listDates ){
                calendar.setTime(date);

                var checkExist = propertyExceptionDateRepository.findByPropertyIdAndDate(propertyId, calendar.getTime());

                if(checkExist != null){
                    checkExist.setBasePrice(price);
                    propertyExceptionDateRepository.save(checkExist);
                }

                if(checkExist == null){
                    PropertyExceptionDate newPropertyExceptionDate = new PropertyExceptionDate();
                    newPropertyExceptionDate.setDate(calendar.getTime());
                    newPropertyExceptionDate.setProperty(property);
                    newPropertyExceptionDate.setBasePrice(price);
                    propertyExceptionDateRepository.save(newPropertyExceptionDate);
                }
            }

            var webKey = String.format("property_%d_web", property.getId());
            var phoneKey = String.format("property_%d_phone", property.getId());
            var bodyMessage = new HashMap<String, String>();
            bodyMessage.put("message", "This property calendar has updated please refresh to updated new calendar");
            bodyMessage.put("time", new Date().toString());
            firebaseRealTimeService.writeData(webKey, bodyMessage);
            firebaseRealTimeService.writeData(phoneKey, bodyMessage);


            return new CustomResult(200, "Success", null);
        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult changePriceForDates(int propertyId, String start, String end, double price){
        try{
            var property = propertyRepository.findListingById(propertyId);

            if(property == null){
                return new CustomResult(404, "Property not found", null);
            }
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(start);
            Date endDate = dateFormat.parse(end);

            var checkList = bookingRepository.checkIfBlockable(propertyId, startDate, endDate);

            if(!checkList.isEmpty()){
                return new CustomResult(403, "Some one already book that day", checkList);
            }

            Calendar calendar = Calendar.getInstance();

            calendar.setTime(startDate);

            while (!calendar.getTime().after(endDate)) {
                var checkExist = propertyExceptionDateRepository.findByPropertyIdAndDate(propertyId, calendar.getTime());

                if(checkExist != null){
                    checkExist.setBasePrice(price);
                    propertyExceptionDateRepository.save(checkExist);
                }

                if(checkExist == null){
                    PropertyExceptionDate newPropertyExceptionDate = new PropertyExceptionDate();
                    newPropertyExceptionDate.setDate(calendar.getTime());
                    newPropertyExceptionDate.setProperty(property);
                    newPropertyExceptionDate.setBasePrice(price);
                    propertyExceptionDateRepository.save(newPropertyExceptionDate);
                }

                calendar.add(Calendar.DATE, 1);
            }

            var webKey = String.format("property_%d_web", property.getId());
            var phoneKey = String.format("property_%d_phone", property.getId());
            var bodyMessage = new HashMap<String, String>();
            bodyMessage.put("message", "This property calendar has updated please refresh to updated new calendar");
            bodyMessage.put("time", new Date().toString());
            firebaseRealTimeService.writeData(webKey, bodyMessage);
            firebaseRealTimeService.writeData(phoneKey, bodyMessage);


            return new CustomResult(200, "Success", null);
        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult getAllListingOfHost(String email){
        try{
            var user = userRepository.findUserByEmail(email);

            var listings = propertyRepository.findListingByUserId(user.getId());

           List<PropertyMinimizeDto> listDto = new ArrayList<>();

            for(var property: (List<Property>) listings){
                listDto.add(convertFromPropertyToPropertyMinimize(property));
            }

            return new CustomResult(200, "Success", listDto);

        } catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    // code giu
    // code giu
    public CustomResult getListingById(int id) {
        try {
            var property = propertyRepository.findAvailableListing(id);
            if (property != null) {
                PropertyGiuDto propertyDto = new PropertyGiuDto();
                BeanUtils.copyProperties(property, propertyDto);
                // Cos sua code
                var user = property.getUser();
                user.setProperties(null);
                user.setReviews(null);
                user.setHostBookings(null);
                user.setCustomerBookings(null);
                user.setTransactions(null);
                propertyDto.setUser(user);

                if (property.getManagedCity() != null) {
                    propertyDto.setManagedCityId(property.getManagedCity().getId());
                }

                if (property.getRefundPolicy() != null) {
                    propertyDto.setRefundPolicyId(property.getRefundPolicy().getId());
                }

                if (property.getUser() != null) {
                    propertyDto.setUserId(property.getUser().getId());
                }

                if (property.getPropertyCategory() != null) {
                    propertyDto.setPropertyCategoryID(property.getPropertyCategory().getId());
                }

                if (property.getInstantBookRequirement() != null) {
                    propertyDto.setInstantBookRequirementID(property.getInstantBookRequirement().getId());
                }

                List<Integer> amenityList = new ArrayList<>();
                for (var amenity : property.getPropertyAmenities()) {
                    amenityList.add(amenity.getAmenity().getId());
                }
                propertyDto.setPropertyAmenities(amenityList);

                List<String> imageList = new ArrayList<>();
                for (var image : property.getPropertyImages()) {
                    imageList.add(image.getImageName());
                }
                propertyDto.setPropertyImages(imageList);

                // Lấy amenity
                List<AmenityDto> amenityListOb = property.getPropertyAmenities()
                        .stream()
                        .map(propertyAmenity -> {
                            AmenityDto amenityDto = new AmenityDto();
                            BeanUtils.copyProperties(propertyAmenity.getAmenity(), amenityDto);
                            return amenityDto;
                        })
                        .collect(Collectors.toList());
                propertyDto.setAmenity(amenityListOb);
                // Lấy date thay đổi base-price
                List<PropertyExceptionDate> propertyExceptionDate = property.getPropertyExceptionDates()
                        .stream()
                        .map(propertyException -> propertyException)
                        .collect(Collectors.toList());
                propertyDto.setExceptionDates(propertyExceptionDate);
                // Lay date bi host block
                List<PropertyNotAvailableDate> propertyNotAvailableDates = property.getPropertyNotAvailableDates()
                        .stream()
                        .map(notAvailableDates -> notAvailableDates)
                        .collect(Collectors.toList());
                propertyDto.setNotAvailableDates(propertyNotAvailableDates);

                // Lấy danh sách các Booking theo propertyId
                List<Booking> bookings = property.getBookings();

                Calendar calendar = Calendar.getInstance();
                calendar.setTime(new Date());
                calendar.add(Calendar.DAY_OF_MONTH, -1);

                var listBookingAccepStatus = bookings.stream()
                        .filter((booking) -> booking.getCheckOutDay().after(calendar.getTime()) && (booking.getStatus().equalsIgnoreCase("ACCEPT")
                                || (booking.getProperty().getBookingType().equalsIgnoreCase("instant") && booking.getStatus().equalsIgnoreCase("TRANSACTIONPENDDING"))))
                        .toList();

                List<BookDateDetail> bookDateDetails = listBookingAccepStatus.stream()
                        .flatMap(booking -> booking.getBookDateDetails().stream())
                        .collect(Collectors.toList());
                propertyDto.setBookDateDetails(bookDateDetails);


                //averga
                double cleanlinessScore = 0;
                double accuracyScore = 0;
                double checkinScore = 0;
                double communicationScore = 0;
                double count = 0;

                List<UserBadge> listBadge = property.getUser().getUserBadges().stream().toList();

                if(!listBadge.isEmpty()){
                    for (UserBadge userBadge : listBadge) {
                        if (userBadge.isShow()){
                            propertyDto.setUserBadgeId(userBadge.getUserBadgeId().getBadgeId());
                            break;
                        }
                    }
                }


                if(!property.getBookings().isEmpty()){
                    for (int i = 0; i < property.getBookings().size(); i++) {
                        if (property.getBookings().get(i).getUserReview()!=null){
                            cleanlinessScore = cleanlinessScore + property.getBookings().get(i).getUserReview().getCleanlinessScore();
                            accuracyScore = accuracyScore + property.getBookings().get(i).getUserReview().getAccuracyScore();
                            checkinScore = checkinScore + property.getBookings().get(i).getUserReview().getCheckinScore();

                            communicationScore = communicationScore + property.getBookings().get(i).getUserReview().getCommunicationScore();
                            count = count + 1;
                        }
                    }
                }
                propertyDto.setAccuracyScore( accuracyScore == 0? 0 : accuracyScore/ count);
                propertyDto.setCheckinScore( checkinScore== 0? 0: checkinScore / count);
                propertyDto.setCommunicationScore(communicationScore == 0 ? 0 : communicationScore / count);
                propertyDto.setCleanlinessScore(cleanlinessScore ==0 ?0:cleanlinessScore/ count);


                return new CustomResult(200, "Success", propertyDto);
            }
            return new CustomResult(404, "Not found", null);
        } catch (Exception e) {
            return new CustomResult(400, "Bad request", e.getMessage());
        }
    }

    public CustomPaging getAllProperties(int pageNumber,
                                         int pageSize,
                                         Integer categoryId,
                                         String name,
                                         String propertyType,
                                         List<Integer> amenities,
                                         String isInstant,
                                         Boolean isSelfCheckIn,
                                         Boolean isPetAllowed,
                                         List<Double> priceRange,
                                         Integer room,
                                         Integer bed,
                                         Integer bathRoom,
                                         Integer guest,
                                         String province,
                                         String district,
                                         String ward,
                                         String startDate,
                                         String endDate
    ){
        try{
            String addressCode;
            if (province != null && district != null && ward != null) {
                addressCode = province + "_" + district + "_" + ward;
            }
            else if (province != null && district == null && ward == null) {
                addressCode = String.valueOf(province)+"_";
            }
            else if (province != null && district != null && ward == null) {
                addressCode = province + "_" + district ;
            }
            else {
                addressCode = null;
            }


            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");

            Pageable pageable = PageRequest.of(pageNumber, pageSize);

            Date start = null;
            Date end = null;

            if(startDate != null && !startDate.isEmpty() ){
                start = sf.parse(startDate);
                end = sf.parse(endDate);

                // Trừ 1 ngày khỏi endDate
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(end);
                calendar.add(Calendar.DAY_OF_MONTH, -1); // Trừ đi 1 ngày
                end = calendar.getTime();
            }

            if(propertyType.isEmpty()){
                propertyType = null;
            }

            if(isInstant.isEmpty()){
                isInstant = null;
            }

            Double minPrice = priceRange != null && priceRange.size() > 0 ? priceRange.get(0) : null;
            Double maxPrice = priceRange != null && priceRange.size() > 1 ? priceRange.get(1) : null;

            var properties = propertyRepository.findPropertiesWithSearchAndFilter(
                    categoryId,
                    name,
                    propertyType,
                    amenities,
                    isInstant,
                    isSelfCheckIn,
                    isPetAllowed,
                    minPrice,
                    maxPrice,
                    room,
                    bed,
                    bathRoom,
                    guest,
                    addressCode,
                    start,
                    end,
                    pageable
            );
            var customPaging =  pagingService.convertToCustomPaging(properties, pageNumber, pageSize);
            double totalStar = 0;
            double totalStarScore = 0;


            List<PropertyHomePageDto> propertyHomePageDtoList = new ArrayList<>();
            for(var property: (List<Property>) customPaging.getData()){
                PropertyHomePageDto propertyHomePageDto = new PropertyHomePageDto();
                BeanUtils.copyProperties(property, propertyHomePageDto);

                for(var booking : property.getBookings()){
                    if(booking.getUserReview() != null){
                        totalStar = totalStar + 1;
                        totalStarScore = totalStarScore + booking.getUserReview().getTotalScore();
                    }
                }


                Double result = Double.valueOf(totalStarScore)   / Double.valueOf(totalStar) ;


                if(!(result).isNaN()){
                    propertyHomePageDto.setAverageRating(totalStarScore / totalStar);
                }else{
                    propertyHomePageDto.setAverageRating(0);
                }






                List<String> images = new ArrayList<>();

                for(var image : property.getPropertyImages()) {
                    images.add(image.getImageName());
                }

                propertyHomePageDto.setPropertyImages(images);

                propertyHomePageDtoList.add(propertyHomePageDto);
            }

            customPaging.setData(propertyHomePageDtoList);

            return customPaging;



        } catch (Exception e) {
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(e.getMessage());
            return customPaging;
        }

    }

    public CustomResult changeBasePriceOfProperty(ChangePropertyPriceDto changePropertyPriceDto){
        try{
            var property = propertyRepository.findById(changePropertyPriceDto.getPropertyId());

            if(property.isEmpty()){
                return new CustomResult(405, "Not found", null);
            }

            property.get().setBasePrice(changePropertyPriceDto.getPrice());

            propertyRepository.save(property.get());

            return new CustomResult(200, "Success", null);

        }catch (Exception e){
            return new CustomResult(400, "Bad request", e.getMessage());
        }
    }

    public CustomResult changeWeeklyOfProperty(ChangePropertyPriceDto changePropertyPriceDto){
        try{
            var property = propertyRepository.findById(changePropertyPriceDto.getPropertyId());

            if(property.isEmpty()){
                return new CustomResult(405, "Not found", null);
            }

            property.get().setWeeklyDiscount(changePropertyPriceDto.getWeeklyDiscount());

            propertyRepository.save(property.get());

            return new CustomResult(200, "Success", null);

        }catch (Exception e){
            return new CustomResult(400, "Bad request", e.getMessage());
        }
    }


    public CustomResult changeMonthlyOfProperty(ChangePropertyPriceDto changePropertyPriceDto){
        try{
            var property = propertyRepository.findById(changePropertyPriceDto.getPropertyId());

            if(property.isEmpty()){
                return new CustomResult(405, "Not found", null);
            }

            property.get().setMonthlyDiscount(changePropertyPriceDto.getMonthlyDiscount());

            propertyRepository.save(property.get());

            return new CustomResult(200, "Success", null);

        }catch (Exception e){
            return new CustomResult(400, "Bad request", e.getMessage());
        }
    }



    PropertyMinimizeDto convertFromPropertyToPropertyMinimize(Property property){

        PropertyMinimizeDto propertyMinimizeDto = new PropertyMinimizeDto();
        BeanUtils.copyProperties(property, propertyMinimizeDto);

        if(property.getManagedCity() != null){
            var managedCityDto = new ManagedCityDto();
            BeanUtils.copyProperties(property.getManagedCity(), managedCityDto);
            propertyMinimizeDto.setManagedCity(managedCityDto);
        }

        if(property.getRefundPolicy() != null){
            var refundDto = new RefundDto();
            BeanUtils.copyProperties(property.getRefundPolicy(), refundDto);
            propertyMinimizeDto.setRefundPolicy(refundDto);
        }


        var userAuthDto = new UserAuthDto();
        BeanUtils.copyProperties(property.getUser(), userAuthDto);
        propertyMinimizeDto.setUser(userAuthDto);

        if(property.getPropertyCategory() != null){
            var categoryDto = new CategoryDto();
            BeanUtils.copyProperties(property.getPropertyCategory(), categoryDto);
            propertyMinimizeDto.setPropertyCategory(categoryDto);
        }


        if(property.getInstantBookRequirement() != null){
            var badgeDto = new BadgeDto();
            BeanUtils.copyProperties(property.getInstantBookRequirement(), badgeDto);
            propertyMinimizeDto.setInstantBookRequirement(badgeDto);

        }

        List<String> images = new ArrayList<>();
        for(var image : property.getPropertyImages()){
            images.add(image.getImageName());
        }
        propertyMinimizeDto.setPropertyImages(images);

        var propertyNotAvailableDateDtoList = new ArrayList<PropertyNotAvailableDateDto>();
        property.getPropertyNotAvailableDates().forEach(propertyNotAvailableDateDto -> {
            PropertyNotAvailableDateDto propertyNotAvailableDate = new PropertyNotAvailableDateDto();
            BeanUtils.copyProperties(propertyNotAvailableDateDto, propertyNotAvailableDate);
            propertyNotAvailableDateDtoList.add(propertyNotAvailableDate);
        });
        propertyMinimizeDto.setPropertyNotAvailableDates(propertyNotAvailableDateDtoList);


        var propertyExceptionDateDtoArrayList = new ArrayList<PropertyExceptionDateDto>();
        property.getPropertyExceptionDates().forEach(propertyExceptionDate -> {
            PropertyExceptionDateDto propertyNotAvailableDateDto = new PropertyExceptionDateDto();
            BeanUtils.copyProperties(propertyExceptionDate, propertyNotAvailableDateDto);
            propertyExceptionDateDtoArrayList.add(propertyNotAvailableDateDto);
        });
        propertyMinimizeDto.setPropertyExceptionDates(propertyExceptionDateDtoArrayList);


        var amenityList = new ArrayList<AmenityDto>();
        property.getPropertyAmenities().forEach(propertyAmenity -> {
            AmenityDto amenityDto = new AmenityDto();
            BeanUtils.copyProperties(propertyAmenity.getAmenity(), amenityDto);
            amenityList.add(amenityDto);
        });
        propertyMinimizeDto.setPropertyAmenities(amenityList);

        return propertyMinimizeDto;
    }


}
