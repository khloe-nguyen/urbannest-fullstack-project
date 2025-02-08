package com.service.main.service.customer;

import com.service.main.dto.*;
import com.service.main.dto.refundDto.request.RefundForBookingRequest;
import com.service.main.entity.*;
import com.service.main.repository.*;
import com.service.main.service.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class BookingCMService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PagingService pagingService;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private ManagedCityCMService managedCityCMService;

    @Autowired
    private BookDateDetailRepository bookDateDetailRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PropertyExceptionDateRepository propertyExceptionDateRepository;

    @Autowired
    private PropertyNotAvailableDateRepository propertyNotAvailableDateRepository;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private StringGenerator stringGenerator;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private FirebaseMessagingService firebaseMessagingService;

    @Autowired
    private FirebaseRealTimeService firebaseRealTimeService;

    private final ModelMapper modelMapper = new ModelMapper();

    public CustomPaging getReservedBooking(String email, String status, int pageNumber, int pageSize, String startDate, String endDate, Integer propertyId) {
        try {
            var user = userRepository.findUserByEmail(email);

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

            Date start = null;
            Date end = null;

            if (startDate != null) {
                start = dateFormat.parse(startDate);
                end = dateFormat.parse(endDate);
            }

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("checkInDay"));
            var bookings = bookingRepository.findReservedBooking(user.getId(), start, end, propertyId, status, pageable);

            var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);

            List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

            for (var booking : (List<Booking>) customPaging.getData()) {
                var bookingDto = convertToMinimizeDto(booking);
                bookingsDtos.add(bookingDto);
            }
            customPaging.setData(bookingsDtos);
            return customPaging;


        } catch (Exception e) {
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(e.getMessage());
            return customPaging;
        }
    }

    public CustomResult getBookingCount(String email) {
        try {
            var user = userRepository.findUserByEmail(email);

            var bookingCount = bookingRepository.getBookingCounts(user.getId(), new Date());

            return new CustomResult(200, "Success", bookingCount);
        } catch (Exception e) {
            return new CustomResult(400, "Bad request", e.getMessage());
        }
    }


    public CustomPaging getBookings(int pageNumber, int pageSize, String email, String status, boolean groupDate) {
        try {
            var host = userRepository.findUserByEmail(email);


            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("checkInDay").ascending());

            if (status.equals("hosting")) {

                if(!groupDate) {
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                var currentlyHosting = bookingRepository.getCurrentlyHostingBook(host.getId(), new Date(), pageable);

                return getBookingCustomPaging(currentlyHosting, pageNumber, pageSize);
            }

            if (status.equals("checkout")) {

                if(!groupDate) {
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                var checkoutBooks = bookingRepository.getCheckoutHostingBook(host.getId(), new Date(), pageable);

                return getBookingCustomPaging(checkoutBooks, pageNumber, pageSize);
            }

            if (status.equals("soon")) {

                if(!groupDate) {
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                var checkinBooks = bookingRepository.getCheckInHostingBook(host.getId(), new Date(), pageable);
                return getBookingCustomPaging(checkinBooks, pageNumber, pageSize);
            }

            if (status.equals("upcoming")) {

                if(!groupDate) {
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                var upcomingBook = bookingRepository.getUpcomingHostingBook(host.getId(), new Date(), pageable);
                return getBookingCustomPaging(upcomingBook, pageNumber, pageSize);
            }

            if (status.equals("pending")) {

                if(!groupDate) {
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                var upcomingBook = bookingRepository.getPendingReviewHostingBook(host.getId(), new Date(), pageable);
                return getBookingCustomPaging(upcomingBook, pageNumber, pageSize);
            }

            return new CustomPaging();
        } catch (Exception ex) {
            return new CustomPaging();
        }
    }

    public CustomResult getBookingOfProperty(int propertyId) {
        try {
            var bookings = bookingRepository.findAllByPropertyId(propertyId);

            List<BookingMinimizeDto> bookingsDto = new ArrayList<>();

            for (var booking : bookings) {
                var newBookingDto = convertToMinimizeDto(booking);

                bookingsDto.add(newBookingDto);
            }

            return new CustomResult(200, "Success", bookingsDto);
        } catch (Exception ex) {
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult checkBookingConflict(int bookingId) {
        try {
            var booking = bookingRepository.findById(bookingId);

            if (booking.isEmpty()) {
                return new CustomResult(404, "Not found", null);
            }

            var conflictList = bookingRepository.checkBookingConflict(bookingId, booking.get().getProperty().getId(), booking.get().getCheckInDay(), booking.get().getCheckOutDay());

            List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();
            for (var bookingDto : conflictList) {
                var bookingDtoDto = convertToMinimizeDto(bookingDto);

                bookingsDtos.add(bookingDtoDto);
            }

            return new CustomResult(200, "Success", bookingsDtos);

        } catch (Exception ex) {
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult denyBooking(int bookingId) {
        try {
            var booking = bookingRepository.findById(bookingId);

            if (booking.isEmpty()) {
                return new CustomResult(404, "Not found", null);
            }

            if (!booking.get().getStatus().equals("PENDING") && !booking.get().getBookingType().equals("reserved")) {
                return new CustomResult(403, "Booking error", null);
            }

            booking.get().setStatus("DENIED");

            bookingRepository.save(booking.get());

            return new CustomResult(200, "Success", null);
        } catch (Exception ex) {
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomResult acceptBooking(AcceptReservationBookingDto acceptReservationBookingDto) {
        try {
            var booking = bookingRepository.findById(acceptReservationBookingDto.getBookingId());

            if (booking.isEmpty()) {
                return new CustomResult(404, "Not found", null);
            }

            if (!booking.get().getStatus().equals("PENDING") && !booking.get().getBookingType().equals("reserved")) {
                return new CustomResult(403, "Booking error", null);
            }


            booking.get().setStatus("ACCEPT");

            bookingRepository.save(booking.get());

            var newNotification = new Notification();
            newNotification.setUser(booking.get().getProperty().getUser());
            newNotification.setCreatedAt(new Date());
            newNotification.setRead(false);
            newNotification.setUrl("/trips");
            newNotification.setMessage(String.format("Host of property %s has accept your booking please see the detail and review, contact admin if you need any help from us",booking.get().getProperty().getPropertyTitle()));
            notificationRepository.save(newNotification);


            var pushNotification = new PushNotificationDto();
            pushNotification.setImage((booking.get().getProperty().getUser().getAvatar() != null ? booking.get().getProperty().getUser().getAvatar() : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"));
            pushNotification.setBody("Your booking has been accepted please view notification for more detail");
            pushNotification.setSubject("Acceptance of booking");
            pushNotification.setData(new HashMap<String, String>());
            pushNotification.setUserId(booking.get().getCustomer().getId());

            firebaseMessagingService.sendNotificationToUser(pushNotification);


            var webKey = String.format("notification_%d_web", booking.get().getCustomer().getId());
            var phoneKey = String.format("notification_%d_phone", booking.get().getCustomer().getId());
            var bodyMessage = new HashMap<String, String>();
            bodyMessage.put("message", "Your booking has been accepted please view notification for more detail");
            bodyMessage.put("mobile", "false");
            bodyMessage.put("web", "false");

            firebaseRealTimeService.writeData(webKey, bodyMessage);
            firebaseRealTimeService.writeData(phoneKey, bodyMessage);


            if(acceptReservationBookingDto.getCancelBookingIds() != null){
                for (var cancel : acceptReservationBookingDto.getCancelBookingIds()) {
                    var cancelBooking = bookingRepository.findById(cancel);

                    if (cancelBooking.isEmpty()) {
                        return new CustomResult(404, "Not found cancel booking", null);
                    }

                    if (!cancelBooking.get().getStatus().equals("PENDING") && !cancelBooking.get().getBookingType().equals("reserved")) {
                        return new CustomResult(403, "Booking error", null);
                    }

                    cancelBooking.get().setStatus("DENIED");
                    bookingRepository.save(cancelBooking.get());


                    var newDenyNotification = new Notification();
                    newDenyNotification.setUser(booking.get().getProperty().getUser());
                    newDenyNotification.setCreatedAt(new Date());
                    newDenyNotification.setRead(false);
                    newDenyNotification.setUrl("/trips");
                    newDenyNotification.setMessage(String.format("Host of property %s has denied your booking please see the detail and review, contact admin if you need any help from us",booking.get().getProperty().getPropertyTitle()));
                    notificationRepository.save(newDenyNotification);


                    var pushDeniedNotification = new PushNotificationDto();
                    pushDeniedNotification.setImage((booking.get().getProperty().getUser().getAvatar() != null ? booking.get().getProperty().getUser().getAvatar() : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"));
                    pushDeniedNotification.setBody("Your booking has been denied please view notification for more detail");
                    pushDeniedNotification.setSubject("Denied of booking");
                    pushDeniedNotification.setData(new HashMap<String, String>());
                    pushDeniedNotification.setUserId(booking.get().getCustomer().getId());

                    firebaseMessagingService.sendNotificationToUser(pushDeniedNotification);


                    var webDeniedKey = String.format("notification_%d_web", booking.get().getCustomer().getId());
                    var phoneDeniedKey = String.format("notification_%d_phone", booking.get().getCustomer().getId());
                    var bodyDeniedMessage = new HashMap<String, String>();
                    bodyDeniedMessage.put("message", "Your booking has been denied please view notification for more detail");
                    bodyDeniedMessage.put("mobile", "false");
                    bodyDeniedMessage.put("web", "false");

                    firebaseRealTimeService.writeData(webDeniedKey, bodyDeniedMessage);
                    firebaseRealTimeService.writeData(phoneDeniedKey, bodyDeniedMessage);
                }
            }


            return new CustomResult(200, "Success", null);

        } catch (Exception ex) {
            return new CustomResult(400, "Bad request", ex.getMessage());

        }
    }

    private CustomPaging getBookingCustomPaging(Page<Booking> bookings, int pageNumber, int pageSize) {
        var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);
        List<BookingMinimizeDto> bookingDtoList = new ArrayList<>();

        for (var book : (List<Booking>) customPaging.getData()) {
            BookingMinimizeDto bookingMinimizeDto = convertToMinimizeDto(book);
            bookingDtoList.add(bookingMinimizeDto);
        }
        customPaging.setData(bookingDtoList);


        return customPaging;
    }

    // code giu

    public CustomResult createBooking(PropertyBookingDto bookingDto) {
        try {
            var optionalProperty = propertyRepository.findById(bookingDto.getPropertyId());
            if (optionalProperty.isEmpty()) {
                return new CustomResult(404, "Property not found", null);
            }
            Property property = optionalProperty.get();

            var optionalCustomer = userRepository.findById(bookingDto.getCustomerId());
            if (optionalCustomer.isEmpty()) {
                return new CustomResult(404, "User not found", null);
            }
            User customer = optionalCustomer.get();

            var optionalHost = userRepository.findById(bookingDto.getHostId());
            if (optionalHost.isEmpty()) {
                return new CustomResult(404, "Host not found", null);
            }
            User host = optionalHost.get();
            // check host and customer
            if (Objects.equals(customer.getId(), host.getId())) {
                return new CustomResult(400, "Host cannot book their own property", null);
            }

            // Check booking type and badge
            if (property.getBookingType().equalsIgnoreCase("Instant")) {
                List<UserBadge> listUserBadge = (List<UserBadge>) customer.getUserBadges();
                if (property.getInstantBookRequirement() != null) {
                    var checkBadge = listUserBadge.stream()
                            .filter(userBadge -> userBadge.getBadge().getId().equals(property.getInstantBookRequirement().getId()))
                            .findFirst()
                            .orElse(null);
                    if (checkBadge == null) {

                        return new CustomResult(404, "Bagde not match", null);
                    }
                }
            }
            // Get and check city available
            CustomResult cusCity = managedCityCMService.getManagedCity();

            List<ManagedCityDto> managedCities = (List<ManagedCityDto>) cusCity.getData();

            var checkCity = managedCities.stream()
                    .filter(city -> city.getId() == property.getManagedCity().getId())
                    .findFirst()
                    .orElse(null);

            if (checkCity != null) {
            } else {
                return new CustomResult(404, "Manage city not found", null);

            }
            // Get exceptiondate
            Date startDate = bookingDto.getCheckInDay();
            Date endDate = bookingDto.getCheckOutDay();
            var optionalListNotAvailable = propertyNotAvailableDateRepository.findByPropertyId(property.getId());
            if (!optionalListNotAvailable.isEmpty()) {

                List<PropertyNotAvailableDate> listNotAvailabledate = (List<PropertyNotAvailableDate>) optionalListNotAvailable
                        .get();

                List<LocalDate> listDateBookingDto = new ArrayList<>();

                LocalDate startLocalDate = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalDate endLocalDate = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

                // Generate all dates between check-in and check-out
                LocalDate currentDate = startLocalDate;
                while (!currentDate.isAfter(endLocalDate) && !currentDate.isEqual(endLocalDate)) {
                    listDateBookingDto.add(currentDate);
                    currentDate = currentDate.plusDays(1); // Add one day
                }
                boolean check = false; // Set to true initially, meaning the date is available

                for (PropertyNotAvailableDate unavailableDate : listNotAvailabledate) {
                    LocalDate unavailableLocalDate = unavailableDate.getDate().toInstant().atZone(ZoneId.systemDefault())
                            .toLocalDate();

                    for (LocalDate bookingDate : listDateBookingDto) {
                        if (unavailableLocalDate.equals(bookingDate)) {
                            check = true;
                            break;
                        }
                    }
                    if (check) {
                        return new CustomResult(400, "Not available date", null);
                    }
                }
            }
            var optionalListBookDateDetail = bookDateDetailRepository.findByPropertyId(property.getId());
            if (optionalListBookDateDetail.isPresent()) {

                List<BookDateDetail> listBookDateDetail = optionalListBookDateDetail.get();

                List<LocalDate> listDateBookingDto = new ArrayList<>();

                LocalDate startLocalDate = startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                LocalDate endLocalDate = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

                // Generate all dates between check-in and check-out
                LocalDate currentDate = startLocalDate;
                while (!currentDate.isAfter(endLocalDate) && !currentDate.isEqual(endLocalDate)) {
                    listDateBookingDto.add(currentDate);
                    currentDate = currentDate.plusDays(1); // Add one day
                }

                boolean check = false;

                for (BookDateDetail dateDetails : listBookDateDetail) {
                    if (dateDetails.getBooking().getBookingType().equals("reserved")) {
                        continue;
                    }
                    if (dateDetails.getBooking().getStatus().equals("denied")) {
                        continue;
                    }

                    LocalDate dateBooked = LocalDate.ofInstant(dateDetails.getNight().toInstant(), ZoneId.systemDefault());

                    for (LocalDate bookingDate : listDateBookingDto) {
                        if (dateBooked.equals(bookingDate)) {
                            check = true;
                            break;
                        }
                    }
                    if (check) {
                        return new CustomResult(410, "Some days have been booked", dateBooked);
                    }
                }
            }

            Booking booking = new Booking();

            BeanUtils.copyProperties(bookingDto, booking);

            booking.setRefundPolicy(property.getRefundPolicy());
            booking.setBookingType(property.getBookingType());
            booking.setCustomer(customer);
            booking.setHost(host);
            booking.setTotalPerson(bookingDto.getAdult() + bookingDto.getChildren());
            booking.setProperty(property);

            Calendar calendarCheckIn = Calendar.getInstance();
            calendarCheckIn.setTime(bookingDto.getCheckInDay());
            calendarCheckIn.set(Calendar.HOUR_OF_DAY, Integer.parseInt(property.getCheckInAfter().split(":")[0]));
            calendarCheckIn.set(Calendar.MINUTE, Integer.parseInt(property.getCheckInAfter().split(":")[1]));
            booking.setCheckInDay(calendarCheckIn.getTime());

            Calendar calendarCheckOut = Calendar.getInstance();
            calendarCheckOut.setTime(bookingDto.getCheckOutDay());
            calendarCheckOut.set(Calendar.HOUR_OF_DAY, Integer.parseInt(property.getCheckOutBefore().split(":")[0]));
            calendarCheckOut.set(Calendar.MINUTE, Integer.parseInt(property.getCheckOutBefore().split(":")[1]));
            booking.setCheckOutDay(calendarCheckOut.getTime());


            String bookingCode = stringGenerator.generateRandomString();
            booking.setBookingCode(bookingCode);
            booking.setAmount(bookingDto.getAmount());
            booking.setSelfCheckIn(property.isSelfCheckIn());
            booking.setSelfCheckInType(property.getSelfCheckInType());
            booking.setSelfCheckInInstruction(property.getSelfCheckInInstruction());

            booking.setStatus("TRANSACTIONPENDDING");

            bookingRepository.save(booking);
            scheduleService.scheduleBookingTimeout(booking.getId(), booking.getCreatedAt());

            long diffInMillies = Math.abs(endDate.getTime() - startDate.getTime());
            long days = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);

            List<PropertyExceptionDate> listException = propertyExceptionDateRepository.findAll();
            Date current = startDate;

            for (int i = 0; i < days; i++) {
                BookDateDetail dateDetail = new BookDateDetail();

                java.sql.Date sqlDate = new java.sql.Date(current.getTime());
                dateDetail.setNight(sqlDate);
                dateDetail.setBooking(booking);
                dateDetail.setProperty(property);

                String dateFormat = "yyyy/MM/dd";
                SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);

                PropertyExceptionDate exceptionDate = listException.stream()
                        .filter(exception -> {

                            String exceptionDateStr = sdf.format(exception.getDate());
                            String sqlDateStr = sdf.format(sqlDate);
                            return exceptionDateStr.equals(sqlDateStr);
                        })
                        .findFirst()
                        .orElse(null);

                if (exceptionDate != null) {
                    dateDetail.setPrice(exceptionDate.getBasePrice());
                } else {
                    dateDetail.setPrice(property.getBasePrice());
                }
                bookDateDetailRepository.save(dateDetail);


                current = new Date(current.getTime() + TimeUnit.DAYS.toMillis(1));
            }

            if(booking.getBookingType().equals("instant")) {
                var webKey = String.format("property_%d_web", booking.getProperty().getId());
                var phoneKey = String.format("property_%d_phone", booking.getProperty().getId());
                var bodyMessage = new HashMap<String, String>();
                bodyMessage.put("message", "This property calendar has updated please upload to updated new calendar");
                bodyMessage.put("time", new Date().toString());
                firebaseRealTimeService.writeData(webKey, bodyMessage);
                firebaseRealTimeService.writeData(phoneKey, bodyMessage);
            }




            return new CustomResult(200, "Booking success", booking);
        } catch (Exception ex) {
            return new CustomResult(400, "Bad request", ex.getMessage());
        }

    }

    // Modelmapper to automatically map
    public CustomResult getBooking(int bookingId) {
        var optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();

            // Map entity sang DTO
            BookingMinimizeDto bookingDto = convertToMinimizeDto(booking);

            return new CustomResult(200, "Find success", bookingDto);
        }
        return new CustomResult(404, "Booking not found", null);
    }


    public CustomPaging getUserTrips(String email,
                                     int pageNumber,
                                     int pageSize,
                                     String status,
                                     String startDate,
                                     String endDate,
                                     boolean groupDate
    ) {
        try {
            var user = userRepository.findUserByEmail(email);

            if (user == null) {
                var customPaging = new CustomPaging();
                customPaging.setStatus(404);
                customPaging.setMessage("Not found");
                return customPaging;
            }

            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");

            Date start = sf.parse(startDate);
            Date end = sf.parse(endDate);



            if (status.equals("checkout")) {

                Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("checkInDay").ascending());

                if(!groupDate){
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                var bookings = bookingRepository.findUserCheckOutTrip(user.getId(), new Date(), start, end, pageable);

                var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);

                List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

                for (var booking : (List<Booking>) customPaging.getData()) {
                    var bookingDto = convertToMinimizeDto(booking);
                    bookingsDtos.add(bookingDto);
                }
                customPaging.setData(bookingsDtos);
                return customPaging;
            }

            if (status.equals("stayin")) {
                Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("checkInDay").ascending());

                if(!groupDate){
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                var bookings = bookingRepository.findUserCurrentlyStayInTrip(user.getId(), new Date(), start, end, pageable);

                var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);

                List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

                for (var booking : (List<Booking>) customPaging.getData()) {
                    var bookingDto = convertToMinimizeDto(booking);
                    bookingsDtos.add(bookingDto);
                }
                customPaging.setData(bookingsDtos);
                return customPaging;
            }


            if (status.equals("upcoming")) {
                Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("checkInDay").ascending());

                if(!groupDate){
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                var bookings = bookingRepository.findUserUpcomingTrip(user.getId(), new Date(), start, end, pageable);

                var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);

                List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

                for (var booking : (List<Booking>) customPaging.getData()) {
                    var bookingDto = convertToMinimizeDto(booking);
                    bookingsDtos.add(bookingDto);
                }
                customPaging.setData(bookingsDtos);
                return customPaging;
            }

            if (status.equals("pending")) {
                Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("checkInDay").ascending());

                if(!groupDate){
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                Calendar calendar = Calendar.getInstance();
                calendar.setTime(new Date());
                calendar.add(Calendar.DAY_OF_MONTH, 7);
                Date expiredDate = calendar.getTime();


                var bookings = bookingRepository.findUserPendingReviewTrip(user.getId(), new Date(), start, end, expiredDate, pageable);


                var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);

                List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

                for (var booking : (List<Booking>) customPaging.getData()) {
                    var bookingDto = convertToMinimizeDto(booking);
                    bookingsDtos.add(bookingDto);
                }
                customPaging.setData(bookingsDtos);
                return customPaging;
            }

            if (status.equals("history")) {
                Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("checkInDay").descending());

                if(!groupDate){
                    pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
                }

                var bookings = bookingRepository.findUserHistoryTrip(user.getId(), new Date(), start, end, pageable);

                var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);

                List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

                for (var booking : (List<Booking>) customPaging.getData()) {
                    var bookingDto = convertToMinimizeDto(booking);
                    bookingsDtos.add(bookingDto);
                }
                customPaging.setData(bookingsDtos);
                return customPaging;
            }

            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage("wrong status");
            return customPaging;

        } catch (Exception e) {
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(e.getMessage());
            return customPaging;
        }
    }


    public CustomResult cancelReservation(int reservationId) {
        try{
            var reservation = bookingRepository.findBookingById(reservationId);

            if(reservation == null) {
                return new CustomResult(404, "Not found", null);
            }

            if(!reservation.getStatus().equals("PENDING") ){
                return new CustomResult(403, "Reseravtion cannot be cancel", null);
            }


            reservation.setStatus("USER_CANCEL");

            bookingRepository.save(reservation);
            return new CustomResult(200, "Success", null);
        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }

    }

    public CustomPaging getUserRefunds(String email,
                                     int pageNumber,
                                     int pageSize,
                                     String startDate,
                                     String endDate) {
        try {
            var user = userRepository.findUserByEmail(email);

            if (user == null) {
                var customPaging = new CustomPaging();
                customPaging.setStatus(404);
                customPaging.setMessage("Not found");
                return customPaging;
            }

            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");

            Date start = sf.parse(startDate);
            Date end = sf.parse(endDate);

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("checkInDay").descending());

            var refundList = bookingRepository.findUserRefundList(user.getId(), start, end, pageable);

            var customPaging = pagingService.convertToCustomPaging(refundList, pageNumber, pageSize);

            List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

            for (var booking : (List<Booking>) customPaging.getData()) {
                var bookingDto = convertToMinimizeDto(booking);
                bookingsDtos.add(bookingDto);
            }
            customPaging.setData(bookingsDtos);
            return customPaging;


        } catch (Exception e) {
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(e.getMessage());
            return customPaging;
        }
    }

    public CustomResult getTripCount(String email,
                                     String startDate,
                                     String endDate) {
        try {
            var user = userRepository.findUserByEmail(email);

            if (user == null) {
                return new CustomResult(404, "Not found", null);
            }

            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");

            Date start = sf.parse(startDate);
            Date end = sf.parse(endDate);

            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.add(Calendar.DAY_OF_MONTH, 7);
            Date expiredDate = calendar.getTime();

            var tripCount = bookingRepository.getTripCounts(user.getId(), start, end,expiredDate, new Date());

            return new CustomResult(200, "OK", tripCount);
        } catch (Exception e) {
            return new CustomResult(400, e.getMessage(), null);
        }
    }

    public CustomPaging getUserReservationTrips(
            String email,
            int pageNumber,
            int pageSize,
            String status,
            String startDate,
            String endDate) {
        try {
            var user = userRepository.findUserByEmail(email);

            if (user == null) {
                var customPaging = new CustomPaging();
                customPaging.setStatus(404);
                customPaging.setMessage("Not found");
                return customPaging;
            }

            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");

            Date start = sf.parse(startDate);
            Date end = sf.parse(endDate);

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("checkInDay").descending());

            if (status.equals("pending")) {
                var bookings = bookingRepository.findUserPendingReserved(user.getId(), start, end, pageable);

                var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);

                List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

                for (var booking : (List<Booking>) customPaging.getData()) {
                    var bookingDto = convertToMinimizeDto(booking);
                    bookingsDtos.add(bookingDto);
                }
                customPaging.setData(bookingsDtos);
                return customPaging;
            }

            if (status.equals("denied")) {
                var bookings = bookingRepository.findUserDeniedReservedTrip(user.getId(), start, end, pageable);

                var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);

                List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

                for (var booking : (List<Booking>) customPaging.getData()) {
                    var bookingDto = convertToMinimizeDto(booking);
                    bookingsDtos.add(bookingDto);
                }
                customPaging.setData(bookingsDtos);
                return customPaging;
            }


            if (status.equals("cancel")) {
                var bookings = bookingRepository.findUserCancelReservedTrip(user.getId(), start, end, pageable);

                var customPaging = pagingService.convertToCustomPaging(bookings, pageNumber, pageSize);

                List<BookingMinimizeDto> bookingsDtos = new ArrayList<>();

                for (var booking : (List<Booking>) customPaging.getData()) {
                    var bookingDto = convertToMinimizeDto(booking);
                    bookingsDtos.add(bookingDto);
                }
                customPaging.setData(bookingsDtos);
                return customPaging;
            }


            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage("wrong status");
            return customPaging;

        } catch (Exception e) {
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(e.getMessage());
            return customPaging;
        }
    }

    public CustomResult getReservedCount(String email,
                                         String startDate,
                                         String endDate) {
        try {
            var user = userRepository.findUserByEmail(email);

            if (user == null) {
                return new CustomResult(404, "Not found", null);
            }

            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");

            Date start = sf.parse(startDate);
            Date end = sf.parse(endDate);

            var tripCount = bookingRepository.getReservedCount(user.getId(), start, end);

            return new CustomResult(200, "OK", tripCount);
        } catch (Exception e) {
            return new CustomResult(400, e.getMessage(), null);
        }
    }


    BookingMinimizeDto convertToMinimizeDto(Booking bookingDto) {
        BookingMinimizeDto bookingMinimizeDto = new BookingMinimizeDto();
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

        if (bookingDto.getProperty().getInstantBookRequirement() != null) {
            var badgeDto = new BadgeDto();
            BeanUtils.copyProperties(bookingDto.getProperty().getInstantBookRequirement(), badgeDto);
            propertyMinimizeDto.setInstantBookRequirement(badgeDto);
        }

        List<String> images = new ArrayList<>();
        for (var image : bookingDto.getProperty().getPropertyImages()) {
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


        if (bookingDto.getHostReview() != null) {
            var hostReview = new ReviewMinimizeDto();
            BeanUtils.copyProperties(bookingDto.getHost(), hostReview);
            var userDto = new UserDto();
            BeanUtils.copyProperties(bookingDto.getHost(), userDto);
            hostReview.setUser(userDto);
            bookingMinimizeDto.setHostReview(hostReview);
        }

        if (bookingDto.getUserReview() != null) {
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

    public CustomResult changeBookingInstruction(BookingInstruction bookingInstruction) {
        try {
            Booking booking = bookingRepository.findBookingById(bookingInstruction.getBookingId());

            if (booking == null) {
                return new CustomResult(404, "Not found", null);
            }

            booking.setSelfCheckInInstruction(bookingInstruction.getInstruction());

            bookingRepository.save(booking);

            return new CustomResult(200, "Success", null);

        } catch (Exception e) {
            return new CustomResult(400, e.getMessage(), null);
        }
    }

    public CustomResult updateRefundForBooking(RefundForBookingRequest request) {
        try {
            var booking = bookingRepository.findBookingById(request.getBookingId());
            if (booking == null) {
                return new CustomResult(404, "Not found", null);
            }

            // If Booking Policy Type is Moderate
            if (booking.getRefundPolicy().getId() == 1) {
                if (!isBefore7DateTime(booking.getCheckInDay())
                ) {
                    return new CustomResult(403, "Refund Time must before 7 days", null);
                }
                booking.setStatus("REFUND");
                // Record for customer;
                Transaction transactionForCustomer = new Transaction();
                transactionForCustomer.setTransactionType("refund");
                transactionForCustomer.setAmount(booking.getAmount() * 100 / 105);
                transactionForCustomer.setTransferOn(new Date());
                transactionForCustomer.setUser(booking.getCustomer());
                transactionForCustomer.setBooking(booking);

                Transaction transactionForWebsiteFee = new Transaction();
                transactionForWebsiteFee.setTransactionType("website_fee");
                transactionForWebsiteFee.setAmount(booking.getAmount() * 5 / 105);
                transactionForWebsiteFee.setTransferOn(new Date());
                transactionForWebsiteFee.setUser(null);
                transactionForWebsiteFee.setBooking(booking);


                bookingRepository.save(booking);
                transactionRepository.save(transactionForCustomer);
                transactionRepository.save(transactionForWebsiteFee);
                return new CustomResult(200, "Refund for Moderate success", null);

            }

            if (booking.getRefundPolicy().getId() == 2) {
                boolean test1 = isBefore5DateTime(booking.getCheckInDay());
                boolean test2 = isBefore2DateTime(booking.getCheckInDay());
                boolean test3 = !isBefore2DateTime(booking.getCheckInDay());

                if (isBefore5DateTime(booking.getCheckInDay())
                ) {
                    booking.setStatus("REFUND");
                    // Record for customer;
                    Transaction transactionForCustomer = new Transaction();
                    transactionForCustomer.setTransactionType("refund");
                    transactionForCustomer.setAmount(booking.getAmount() * 100 / 105);
                    transactionForCustomer.setTransferOn(new Date());
                    transactionForCustomer.setUser(booking.getCustomer());
                    transactionForCustomer.setBooking(booking);

                    Transaction transactionForWebsiteFee = new Transaction();
                    transactionForWebsiteFee.setTransactionType("website_fee");
                    transactionForWebsiteFee.setAmount(booking.getAmount() * 5 / 105);
                    transactionForWebsiteFee.setTransferOn(new Date());
                    transactionForWebsiteFee.setUser(null);
                    transactionForWebsiteFee.setBooking(booking);


                    bookingRepository.save(booking);
                    transactionRepository.save(transactionForCustomer);
                    transactionRepository.save(transactionForWebsiteFee);
                    return new CustomResult(200, "Refund before 5 days success", null);
                }
                if (isBefore2DateTime(booking.getCheckInDay())) {
                    booking.setStatus("REFUND");
                    Transaction transactionForCustomer = new Transaction();
                    transactionForCustomer.setTransactionType("refund");
                    transactionForCustomer.setAmount(booking.getAmount() * 50 / 105);
                    transactionForCustomer.setTransferOn(new Date());
                    transactionForCustomer.setUser(null);
                    transactionForCustomer.setBooking(booking);

                    var hostFee = booking.getAmount() * 50 / 105;
                    Transaction transactionForHostFee = new Transaction();
                    transactionForHostFee.setTransactionType("host_fee");
                    transactionForHostFee.setAmount(hostFee);
                    transactionForHostFee.setTransferOn(new Date());
                    transactionForHostFee.setUser(null);
                    transactionForHostFee.setBooking(booking);

                    Transaction transactionForWebsiteFee = new Transaction();
                    transactionForWebsiteFee.setTransactionType("website_fee");
                    transactionForWebsiteFee.setAmount((hostFee * 5 / 100) + booking.getAmount() * 5 / 100);
                    transactionForWebsiteFee.setTransferOn(new Date());
                    transactionForWebsiteFee.setUser(null);
                    transactionForWebsiteFee.setBooking(booking);

                    bookingRepository.save(booking);
                    transactionRepository.save(transactionForCustomer);
                    transactionRepository.save(transactionForHostFee);
                    transactionRepository.save(transactionForWebsiteFee);

                    return new CustomResult(200, "Refund before in range 2-5 days success", null);

                }
                if (!isBefore2DateTime(booking.getCheckInDay())) {
                    return new CustomResult(403, "Refund Time must before 2 days", null);
                }
            }
            return new CustomResult(201, "Request Success but nothing change", null);
        } catch (Exception e) {
            throw new RuntimeException("Cant get Booking Object");
        }
    }

    public CustomResult getBookingBasedOnQr(String email, String qrcode){
        try{

            var user = userRepository.findUserByEmail(email);

            if(user == null){
                return new CustomResult(404, "User not found", null);
            }

            var booking = bookingRepository.findBookingByQrCode(user.getId(), qrcode);

            if(booking == null){
                return new CustomResult(404, "Booking not found", null);
            }

            var bookingMinimizeDto = convertToMinimizeDto(booking);



            return new CustomResult(200, "Success", bookingMinimizeDto);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }



    private boolean isBefore7DateTime(Date bookingDate) {
        LocalDateTime bookingDateTime = bookingDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        String dateTimeBefore7DaysString = "2025-01-01 15:30:00";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime dateTimeBefore7Days = LocalDateTime.parse(dateTimeBefore7DaysString, formatter);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = bookingDateTime.minusDays(7);

        return now.isBefore(sevenDaysAgo);
    }

    private boolean isBefore5DateTime(Date bookingDate) {
        LocalDateTime bookingDateTime = bookingDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime now = LocalDateTime.now();

        LocalDateTime fiveDaysAgo = bookingDateTime.minusDays(5);
        return now.isBefore(fiveDaysAgo);
    }

    private boolean isBefore2DateTime(Date bookingDate) {
        LocalDateTime bookingDateTime = bookingDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime twoDaysAgo = bookingDateTime.minusDays(2);
        return now.isBefore(twoDaysAgo);
    }

}
