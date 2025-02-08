package com.service.main.service.seeder_service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.javafaker.Faker;
import com.service.main.dto.AddressDto;
import com.service.main.dto.BookingDateDto;
import com.service.main.entity.*;
import com.service.main.repository.*;
import com.service.main.service.StringGenerator;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class UserSeeder {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyImageRepository propertyImageRepository;

    @Autowired
    private PropertyCategoryRepository propertyCategoryRepository;

    @Autowired
    private ManagedCityRepository managedCityRepository;

    @Autowired
    private RefundPolicyRepository refundPolicyRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private PropertyAmenityRepository propertyAmenityRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private BookDateDetailRepository bookDateDetailRepository;

    @Autowired
    private StringGenerator stringGenerator;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    private static final Logger log = LoggerFactory.getLogger(UserSeeder.class);
    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public void seedUsers(int numberOfUsers) {
        try {
            Faker faker = new Faker();
            Random random = new Random();
            ObjectMapper objectMapper = new ObjectMapper();

            LocalDate createdAt = LocalDate.of(2022, 1, 1);
            LocalDate dob = LocalDate.of(1980, 2, 1);
            List<String> avatars = objectMapper.readValue(new ClassPathResource("user_image.json").getInputStream(), new TypeReference<List<String>>() {
            });

            Badge userVerifyBadge = badgeRepository.findById(4).get();

            for (int i = 0; i < numberOfUsers; i++) {
                int randomAvatarIndex = random.nextInt(avatars.size());
                var user = new User();
                user.setEmail(faker.internet().emailAddress());
                user.setPassword("$2a$12$jN9B91MY2BAmBmcQHcPk3eMRALYc7X6t3ZBxgkmHCYck8HAawqpO6");
                user.setFirstName(faker.name().firstName());
                user.setLastName(faker.name().lastName());
                user.setCreatedAt(Date.from(createdAt.atStartOfDay(ZoneId.systemDefault()).toInstant()));
                user.setPhoneNumber(faker.phoneNumber().phoneNumber());
                user.setStatus(true);
                user.setUpdatedAt(new Date());
                user.setDob(Date.from(dob.atStartOfDay(ZoneId.systemDefault()).toInstant()));
                String avatar = avatars.get(randomAvatarIndex);
                user.setAvatar(avatar);
                user.setRealAvatar(avatar);
                userRepository.save(user);

                UserBadge userBadge = new UserBadge();
                userBadge.setUser(user);
                userBadge.setBadge(userVerifyBadge);
                UserBadgeId userBadgeId = new UserBadgeId();
                userBadgeId.setUserId(user.getId());
                userBadgeId.setBadgeId(userVerifyBadge.getId());
                userBadge.setUserBadgeId(userBadgeId);

                userBadgeRepository.save(userBadge);

            }


        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Transactional
    public void seedTphcmProperties() {
        try {
            Random random = new Random();
            ObjectMapper objectMapper = new ObjectMapper();
            List<String> propertyImages = objectMapper.readValue(new ClassPathResource("property_image.json").getInputStream(), new TypeReference<List<String>>() {
            });
            List<AddressDto> propertyAdderss = objectMapper.readValue(new ClassPathResource("location.json").getInputStream(), new TypeReference<List<AddressDto>>() {
            });
            List<String> type = Arrays.asList("sharedroom", "fullhouse", "hotel");
            List<PropertyCategory> categories = propertyCategoryRepository.getStatusCategory(true);
            LocalDate createdAt = LocalDate.of(2022, 1, 1);
            ManagedCity tphcmCity = managedCityRepository.findById(236).get();
            List<Integer> biasedRangeGuest = Arrays.asList(3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 8, 9);
            List<Integer> biasedRangeBedRooms = Arrays.asList(1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6);
            RefundPolicy refund = refundPolicyRepository.findById(1).get();

            var users = userRepository.findAll();

            for (User user : users) {

                int numberOfProperty = random.nextInt(3, 6);

                for (int x = 0; x < numberOfProperty; x++) {
                    int basePrice = random.nextInt(50, 150);
                    int weeklyDiscount = random.nextInt(5, 25);
                    int monthlyDiscount = random.nextInt(weeklyDiscount, 50);
                    int numberOfImages = random.nextInt(5, 10);
                    int typeOfProperty = random.nextInt(0, 3);
                    int chosenCategory = random.nextInt(0, categories.size());
                    int chosenLocation = random.nextInt(0, propertyAdderss.size());


                    var newProperty = new Property();
                    newProperty.setUser(user);
                    newProperty.setStatus("PUBLIC");
                    newProperty.setBasePrice(basePrice);
                    newProperty.setWeeklyDiscount(weeklyDiscount);
                    newProperty.setMonthlyDiscount(monthlyDiscount);
                    newProperty.setPropertyType(type.get(typeOfProperty));
                    newProperty.setPropertyCategory(categories.get(chosenCategory));
                    newProperty.setAddressCode(propertyAdderss.get(chosenLocation).getLocation());
                    newProperty.setCoordinatesX(String.valueOf(propertyAdderss.get(chosenLocation).getLat()));
                    newProperty.setCoordinatesY(String.valueOf(propertyAdderss.get(chosenLocation).getLng()));
                    newProperty.setAddressDetail(propertyAdderss.get(chosenLocation).getDetail());
                    newProperty.setCheckInAfter("15:00");
                    newProperty.setCheckOutBefore("15:00");
                    newProperty.setSelfCheckIn(random.nextBoolean());

                    if(newProperty.isSelfCheckIn()){
                        newProperty.setSelfCheckInInstruction(getSelfCheckInInstruction());
                    }

                    newProperty.setBookingType(random.nextBoolean() ? "reserved" : "instant");

                    newProperty.setCreatedAt(Date.from(createdAt.atStartOfDay(ZoneId.systemDefault()).toInstant()));
                    newProperty.setUpdatedAt(new Date());
                    newProperty.setPetAllowed(random.nextBoolean());
                    newProperty.setSmokingAllowed(random.nextBoolean());
                    newProperty.setManagedCity(tphcmCity);
                    newProperty.setPropertyTitle(getPropertyTitle(random.nextInt(0, 190)));
                    newProperty.setAboutProperty(getAboutProperty(random.nextInt(0, 9)));
                    newProperty.setGuestAccess("""
                            <p><span>- In and out 24/7- Security services24/7- ATM nearby- FREE reception and lounge area with Wifi- Fitness &amp; Yoga Center (free)</span></p><p><span>- Swimming pool for adults and children (free of charge)</span></p><p><span>- Gym (free)- Private access key code</span></p><p><span>- Medical services (contact us for assistance if needed)</span></p><p><span>- Family/child friendly- Guests can bring food for cooking and eating.</span></p>""");

                    newProperty.setDetailToNote("""
                            <p><span><strong> We have a check-in team to help you check in and provide your own code and self check-in.</strong> Luggage storage is not guaranteed and requires prior notice.</span></p><p><span>** Photograph of guest's passport is required during check-in.</span></p><p><span>** Please inform us in advance if you plan to bring a stranger home.</span></p><p><span>** Our venue prohibits partying and any illegal activities. Guests who do not follow these rules and our apartment rules will be asked to leave</span></p><p><span>**If needed, we can help prepare extra mattress + pillowPlease confirm your check in time- On the check in date, we will send you the card &amp; code of door- The parking space is in basement (with fee)- We have apartments of this type at Zenity, and a large range of choices at Metropole Thu Thiem, The Marq dist 1, Phu My Hung D7, Ha Long bay and Ha Noi. Please contact us for more details.</span></p>
                            """);


                    newProperty.setMaximumGuest(biasedRangeGuest.get(random.nextInt(biasedRangeGuest.size())));
                    newProperty.setNumberOfBed(biasedRangeBedRooms.get(random.nextInt(biasedRangeBedRooms.size())));
                    newProperty.setNumberOfBathRoom(biasedRangeBedRooms.get(random.nextInt(biasedRangeBedRooms.size())));
                    newProperty.setNumberOfBedRoom(newProperty.getNumberOfBed());
                    newProperty.setMaximumMonthPreBook(9);
                    newProperty.setRefundPolicy(refund);


                    propertyRepository.save(newProperty);

                    for (int j = 0; j < numberOfImages; j++) {
                        var newImage = new PropertyImage();
                        newImage.setProperty(newProperty);
                        var imageIndex = random.nextInt(propertyImages.size());
                        newImage.setImageName(propertyImages.get(imageIndex));
                        propertyImageRepository.save(newImage);
                    }


                    var excludeAmenity = random.nextInt(10, 29);
                    for (int j = 10; j < 29; j++) {
                        if (j == excludeAmenity) {
                            continue;
                        }

                        var propertyAmenity = new PropertyAmenity();
                        var amenity = amenityRepository.findById(j).get();
                        propertyAmenity.setProperty(newProperty);
                        propertyAmenity.setAmenity(amenity);
                        var newPropertyAmenityId = new PropertyAmenityId();
                        newPropertyAmenityId.setPropertyId(newProperty.getId());
                        newPropertyAmenityId.setAmenityId(amenity.getId());
                        propertyAmenity.setId(newPropertyAmenityId);
                        propertyAmenityRepository.save(propertyAmenity);
                    }

                }

            }
        } catch (Exception e) {
            log.error("Error occurred while seeding properties", e);
        }
    }


    @Transactional
    public void seedBooking(){
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            List<BookingDateDto> listDates = objectMapper.readValue(new ClassPathResource("booking_date.json").getInputStream(), new TypeReference<List<BookingDateDto>>() {
            });
            SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
            Random random = new Random();
            RefundPolicy refund = refundPolicyRepository.findById(1).get();

            List<Property> allProperties = propertyRepository.findAll();
            List<User> allUsers = userRepository.findAll();
            List<Integer> biasedScore = Arrays.asList(5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,1,1,1);

            for(var property : allProperties){
                var numberOfBooking = random.nextInt( 50 ,101);

                List<BookingDateDto> dateCopies = new ArrayList<>(listDates);

                for(int i = 0 ; i < numberOfBooking ; i++){
                    var newBooking = new Booking();
                    newBooking.setProperty(property);

                    int chosenIndex;

                    while(true){
                        chosenIndex = random.nextInt(dateCopies.size());
                        Calendar calendar = Calendar.getInstance();
                        calendar.setTime(sf.parse(dateCopies.get(chosenIndex).getCheckIn()));

                        int year = calendar.get(Calendar.YEAR);

                        if(year == 2024 || year == 2023 ){
                            break;
                        }

                        if(random.nextBoolean()){
                            break;
                        }
                    }


                    BookingDateDto chosenDate = dateCopies.get(chosenIndex);
                    Date checkIn = sf.parse(chosenDate.getCheckIn());
                    Date checkOut = sf.parse(chosenDate.getCheckOut());

                    Calendar calendarCheckIn = Calendar.getInstance();
                    calendarCheckIn.setTime(checkIn);
                    calendarCheckIn.set(Calendar.HOUR_OF_DAY, Integer.parseInt(property.getCheckInAfter().split(":")[0]) );
                    calendarCheckIn.set(Calendar.MINUTE, Integer.parseInt(property.getCheckInAfter().split(":")[1]) );
                    newBooking.setCheckInDay(calendarCheckIn.getTime());

                    Calendar calendarCheckOut = Calendar.getInstance();
                    calendarCheckOut.setTime(checkOut);
                    calendarCheckOut.set(Calendar.HOUR_OF_DAY, Integer.parseInt(property.getCheckOutBefore().split(":")[0])  );
                    calendarCheckOut.set(Calendar.MINUTE, Integer.parseInt(property.getCheckOutBefore().split(":")[1]) );

                    newBooking.setCheckOutDay(calendarCheckOut.getTime());
                    newBooking.setBookingType(property.getBookingType());
                    newBooking.setSelfCheckInInstruction(property.getSelfCheckInInstruction());
                    newBooking.setSelfCheckInType(property.getSelfCheckInType());
                    newBooking.setSelfCheckIn(property.isSelfCheckIn());
                    newBooking.setRefundPolicy(refund);


                    String bookingCode = stringGenerator.generateRandomString();
                    newBooking.setBookingCode(bookingCode);
                    var adult = random.nextInt(1, 4);
                    var children = random.nextInt(1, 2);
                    newBooking.setAdult(adult);
                    newBooking.setChildren(children);
                    newBooking.setTotalPerson(adult + children);
                    newBooking.setCreatedAt(LocalDate.parse(chosenDate.getCheckIn()).minusDays(7).atStartOfDay());
                    newBooking.setUpdatedAt(LocalDate.parse(chosenDate.getCheckOut()).atStartOfDay());


                    long diffInMillies = Math.abs(checkIn.getTime() - checkOut.getTime());
                    long days = TimeUnit.DAYS.convert(diffInMillies, TimeUnit.MILLISECONDS);
                    Date current = checkIn;

                    for (int j = 0; j < days; j++) {
                        BookDateDetail dateDetail = new BookDateDetail();
                        java.sql.Date sqlDate = new java.sql.Date(current.getTime());
                        dateDetail.setNight(sqlDate);
                        dateDetail.setBooking(newBooking);
                        dateDetail.setProperty(property);
                        dateDetail.setPrice(property.getBasePrice());
                        bookDateDetailRepository.save(dateDetail);
                        current = new Date(current.getTime() + TimeUnit.DAYS.toMillis(1));
                    }

                    User user = null;
                    do{
                        user = allUsers.get(random.nextInt(allUsers.size()));
                    }while(user.getId().equals(property.getUser().getId()) );

                    newBooking.setCustomer(user);
                    newBooking.setHost(property.getUser());
                    newBooking.setAmount((days * property.getBasePrice()) * 1.05);
                    newBooking.setHostFee((days * property.getBasePrice()) * 0.9);
                    newBooking.setWebsiteFee((days * property.getBasePrice()) * 0.15);

                    if(checkOut.before(new Date())){
                        var hostReview = new Review();
                        hostReview.setBooking(newBooking);
                        hostReview.setUser(property.getUser());
                        hostReview.setToUser(user.getId());
                        hostReview.setCreatedAt(checkOut);
                        hostReview.setUpdatedAt(checkOut);
                        var cleanlinessScoreHost = biasedScore.get(random.nextInt(biasedScore.size()));
                        var accuracyScoreHost = biasedScore.get(random.nextInt(biasedScore.size()));
                        var checkinScoreHost = biasedScore.get(random.nextInt(biasedScore.size()));
                        var communicationScoreHost = biasedScore.get(random.nextInt(biasedScore.size()));
                        hostReview.setCheckinScore(checkinScoreHost);
                        hostReview.setAccuracyScore(accuracyScoreHost);
                        hostReview.setCommunicationScore(communicationScoreHost);
                        hostReview.setCleanlinessScore(cleanlinessScoreHost);
                        hostReview.setTotalScore((cleanlinessScoreHost.doubleValue() + accuracyScoreHost + communicationScoreHost + cleanlinessScoreHost) /4 );
                        hostReview.setReview(getHostReviewCustomer(random.nextInt(96)));
                        reviewRepository.save(hostReview);
                        newBooking.setHostReview(hostReview);

                        var userReview = new Review();
                        userReview.setBooking(newBooking);
                        userReview.setUser(user);
                        userReview.setToUser(property.getUser().getId());
                        userReview.setCreatedAt(checkOut);
                        userReview.setUpdatedAt(checkOut);
                        var cleanlinessScoreUser = biasedScore.get(random.nextInt(biasedScore.size()));
                        var accuracyScoreUser = biasedScore.get(random.nextInt(biasedScore.size()));
                        var checkinScoreUser = biasedScore.get(random.nextInt(biasedScore.size()));
                        var communicationScoreUser = biasedScore.get(random.nextInt(biasedScore.size()));
                        userReview.setCheckinScore(checkinScoreUser);
                        userReview.setAccuracyScore(accuracyScoreUser);
                        userReview.setCommunicationScore(communicationScoreUser);
                        userReview.setCleanlinessScore(cleanlinessScoreUser);
                        userReview.setTotalScore((checkinScoreUser.doubleValue() + accuracyScoreUser + communicationScoreUser + cleanlinessScoreUser) /4 );
                        userReview.setReview(getCustomerReviewHost(random.nextInt(91)));
                        reviewRepository.save(userReview);
                        newBooking.setUserReview(userReview);
                    }


                    if(i != 50 && i != 75 && i != 100 && i != 150 && i != 200 && i != 250 ) {

                        var escrowTransaction = new Transaction();
                        var hostTransaction = new Transaction();
                        var webTransaction = new Transaction();

                        Date transferDate = new Date();

                        if(Date.from(LocalDate.parse(chosenDate.getCheckIn()).minusDays(7).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()).before(transferDate)){
                            transferDate = Date.from(LocalDate.parse(chosenDate.getCheckIn()).minusDays(7).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
                        }

                        escrowTransaction.setTransactionType("escrow");
                        escrowTransaction.setBooking(newBooking);
                        escrowTransaction.setUser(newBooking.getCustomer());
                        escrowTransaction.setTransferOn(transferDate);
                        escrowTransaction.setAmount(newBooking.getAmount());
                        transactionRepository.save(escrowTransaction);

                        if(checkOut.before(new Date())){
                            hostTransaction.setTransactionType("host_fee");
                            hostTransaction.setBooking(newBooking);
                            hostTransaction.setUser(null);
                            hostTransaction.setTransferOn(Date.from(LocalDate.parse(chosenDate.getCheckIn()).plusDays(2).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()));
                            hostTransaction.setAmount(newBooking.getHostFee());
                            transactionRepository.save(hostTransaction);

                            webTransaction.setTransactionType("website_fee");
                            webTransaction.setBooking(newBooking);
                            webTransaction.setUser(null);
                            webTransaction.setTransferOn(Date.from(LocalDate.parse(chosenDate.getCheckIn()).plusDays(2).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()));
                            webTransaction.setAmount(newBooking.getWebsiteFee());
                            transactionRepository.save(webTransaction);
                        }

                        newBooking.setStatus("ACCEPT");
                    }else{
                        Date transferDate = new Date();

                        if(Date.from(LocalDate.parse(chosenDate.getCheckIn()).minusDays(7).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()).before(transferDate)){
                            transferDate = Date.from(LocalDate.parse(chosenDate.getCheckIn()).minusDays(7).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
                        }

                        var escrowTransaction = new Transaction();

                        escrowTransaction.setTransactionType("escrow");
                        escrowTransaction.setBooking(newBooking);
                        escrowTransaction.setUser(newBooking.getCustomer());
                        escrowTransaction.setTransferOn(transferDate);
                        escrowTransaction.setAmount(newBooking.getAmount());
                        transactionRepository.save(escrowTransaction);

//                        if( new Date().before(checkIn)){
                            var refundTransaction = new Transaction();
                            refundTransaction.setTransactionType("refund");
                            refundTransaction.setBooking(newBooking);
                            refundTransaction.setUser(newBooking.getCustomer());
                            refundTransaction.setTransferOn(Date.from(LocalDate.parse(chosenDate.getCheckIn()).minusDays(5).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()));
                            refundTransaction.setAmount(days * property.getBasePrice());
                            transactionRepository.save(refundTransaction);

                            var webTransaction = new Transaction();
                            webTransaction.setTransactionType("website_fee");
                            webTransaction.setBooking(newBooking);
                            webTransaction.setUser(null);
                            webTransaction.setTransferOn(Date.from(LocalDate.parse(chosenDate.getCheckIn()).minusDays(5).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()));
                            webTransaction.setAmount(newBooking.getAmount() - (days * property.getBasePrice()));
                            transactionRepository.save(webTransaction);

                            newBooking.setStatus("REFUND");
//                        }

                    }

                    bookingRepository.save(newBooking);
                    dateCopies.remove(chosenDate);

                }

            }



        }catch (Exception e){
            log.error("Error occurred while seeding properties", e);
        }
    }

    public String getPropertyTitle(int index) {
        List<String> listTitle = Arrays.asList(
                "The Urban Nest",
                "Sunny Haven",
                "The Cozy Spot",
                "Hidden Gem",
                "Modern Escape",
                "The Serene Suite",
                "The Hideaway",
                "The Loft on Elm",
                "Tranquil Abode",
                "Dreamy Dwelling",
                "The Nook",
                "The Comfy Corner",
                "Luxe Living",
                "The Retreat House",
                "The Corner Loft",
                "The Peaceful Pad",
                "The Loft Retreat",
                "Blissful Home",
                "The Urban Hideout",
                "Bright & Airy",
                "The Getaway",
                "The Charm House",
                "The Urban Oasis",
                "The Cozy Loft",
                "The Vibe Space",
                "The Quiet Escape",
                "The Loft on Maple",
                "The Chic Residence",
                "The Comfort Zone",
                "Modern Dream",
                "The Perfect Stay",
                "The Simple Escape",
                "Dreamscape",
                "The City Dwelling",
                "The Cozy Den",
                "The Stylish Loft",
                "The Homestead",
                "The Heart of the City",
                "The Tranquil Loft",
                "The Peaceful Nest",
                "The Hidden Haven",
                "The Dream Loft",
                "The Urban Refuge",
                "The Comfort Loft",
                "Serene Escape",
                "The Nook House",
                "The Bright Space",
                "The Urban Retreat",
                "The Secret Nook",
                "The Minimalist Loft",
                "The Sleek Spot",
                "The Downtown Den",
                "The Calm Space",
                "The Quiet Place",
                "The Comfort House",
                "The Chic Suite",
                "The Cozy Cottage",
                "The Urban Escape",
                "The City Loft",
                "The Luxe Nook",
                "The Dream Suite",
                "The Cozy Place",
                "The City Retreat",
                "The Style Loft",
                "The Tranquil Suite",
                "The Urban Residence",
                "The Simple Stay",
                "The Comfort Den",
                "The Hidden Retreat",
                "The Chill House",
                "The Relax House",
                "The Luxe Suite",
                "The Bright Loft",
                "The Secret Spot",
                "The Calm Retreat",
                "The Hidden Loft",
                "The Urban Spot",
                "The Stylish Spot",
                "The Cozy Refuge",
                "The Quiet Loft",
                "The Tranquil Den",
                "The Luxe Escape",
                "The Chill Loft",
                "The Dream Place",
                "The Simple Loft",
                "The Peace House",
                "The Nook Retreat",
                "The Luxe Retreat",
                "The Chill Spot",
                "The Comfort Loft",
                "The Urban Charm",
                "The Peaceful House",
                "The Sleek Stay",
                "The Dream Place",
                "The Vibe Loft",
                "The Cozy Nest",
                "The Modern Loft",
                "The Bright House",
                "The Quiet Den",
                "The Luxe Home",
                "The Peaceful Retreat",
                "The Cozy Corner",
                "Urban Breeze",
                "The Hidden Loft",
                "The Simple Retreat",
                "The Warm Escape",
                "The Comfort Suite",
                "City Lights Loft",
                "The Hidden Den",
                "The Quiet Spot",
                "The Loft Garden",
                "The Chic Escape",
                "The Luxe Loft",
                "The Secret Suite",
                "The Tranquil Home",
                "The Stylish Retreat",
                "The Peaceful Den",
                "The Dream Retreat",
                "The Urban Getaway",
                "The Cozy Nook",
                "The Lofty View",
                "The Relaxing Loft",
                "The Urban Villa",
                "The Perfect Loft",
                "City Retreat",
                "The Simple Nook",
                "The Luxe House",
                "The Dream Escape",
                "The Serene Space",
                "The Chill Retreat",
                "The Luxe Escape",
                "The Calm Loft",
                "The Hidden Spot",
                "The Cozy Suite",
                "Urban Haven",
                "The Tranquil Cottage",
                "The Stylish Place",
                "The Dream Loft",
                "The Bright Escape",
                "The Chic Den",
                "The Tranquil Retreat",
                "The Luxe Suite",
                "The Hidden House",
                "The Cozy Villa",
                "The Serene Loft",
                "The Peace Loft",
                "The Comfort Suite",
                "The Simple House",
                "The Downtown Loft",
                "The Quiet Escape",
                "The Relax Loft",
                "The Tranquil Place",
                "The Perfect Escape",
                "The Luxe Nook",
                "The Cozy House",
                "The Urban Home",
                "The Serene Suite",
                "The Calm House",
                "The Hidden Loft",
                "The Dream House",
                "The Peaceful Loft",
                "The Urban Corner",
                "The Vibe House",
                "The City Escape",
                "The Calm Den",
                "The Urban Getaway",
                "The Luxe Corner",
                "The Tranquil Loft",
                "The Cozy View",
                "The Secret Place",
                "The Hidden Corner",
                "The Peaceful Home",
                "The Dream Loft",
                "The Urban Den",
                "The Luxe Space",
                "The Cozy Retreat",
                "The Tranquil View",
                "The Simple Loft",
                "The Relax House",
                "The Quiet Suite",
                "The Luxe Escape",
                "The Secret Den",
                "The Urban Spot",
                "The Peaceful Escape",
                "The Bright Loft",
                "The Comfort Nook",
                "The Luxe Retreat",
                "The Stylish Loft",
                "The Cozy Loft",
                "The Hidden Retreat",
                "The Dream Retreat",
                "The Tranquil House",
                "The Urban Suite"

        );

        return listTitle.get(index);
    }

    public String getAboutProperty(int index) {
        List<String> listTitle = Arrays.asList(
                """
                        <div>
                        <h2>Spacious 2-Bedroom Apartment in the Heart of Downtown</h2>
                        <p>Welcome to this cozy 2-bedroom apartment, located in the bustling heart of downtown. Ideal for both short and long stays, this property is perfect for business travelers and tourists alike. Just a 5-minute walk from the main shopping street and close to local cafes and restaurants, you’ll find everything you need right at your doorstep.</p>
                        
                        <p>The apartment features a modern open-plan living area, with a comfortable sofa, a large flat-screen TV, and a dining area that seats four. The kitchen is fully equipped with everything you might need to prepare your own meals, including a stove, microwave, fridge, and coffee maker.</p>
                        
                        <p>The two spacious bedrooms come with queen-sized beds, fresh linens, and ample closet space for all your belongings. The bathroom is clean and functional, with a bathtub/shower combination, a large mirror, and fresh towels provided for each guest.</p>
                        
                        <p>Step outside to a lovely private balcony that overlooks the city skyline, perfect for enjoying a cup of coffee or relaxing after a long day of sightseeing.</p>
                        
                        <p>Our location offers easy access to public transport, with a bus stop and subway station just around the corner. You’ll be able to explore the city with ease. Enjoy the perfect combination of comfort and convenience in this beautiful downtown apartment.</p>
                        </div>""",
                """
                        <div>
                        <h2>Cozy Studio in Trendy Neighborhood</h2>
                        <p>This charming studio apartment is located in one of the trendiest neighborhoods in the city. Whether you're here for work or leisure, you'll appreciate the vibrant surroundings and the comfort of the space.</p>
                        
                        <p>The studio comes with a comfortable queen-sized bed, a sleek sofa, and a stylish desk for those who need to work from home. The kitchen area is fully equipped with a stove, fridge, and all the utensils you'll need to cook up your favorite meals. You’ll find fresh linens, towels, and basic toiletries provided for your stay.</p>
                        
                        <p>Designed with modern aesthetics in mind, the apartment features contemporary furnishings and an open-plan layout that makes the most of the available space. The large windows let in plenty of natural light, making the room feel bright and airy.</p>
                        
                        <p>Enjoy your morning coffee on the private balcony, where you can take in the sights and sounds of this vibrant neighborhood. The building also has a small communal garden, where you can relax or meet fellow guests.</p>
                        
                        <p>With restaurants, shops, and cafes all within walking distance, you’ll never run out of things to do. Public transportation is just a short stroll away, making it easy to explore the city’s main attractions.</p>
                        </div>""",

                """
                        <div>
                        <h2>Luxury Penthouse with Panoramic Views</h2>
                        <p>Experience true luxury in this stunning penthouse located on the top floor of a modern building. With breathtaking panoramic views of the city, this property offers the perfect combination of elegance, comfort, and convenience.</p>
                        
                        <p>The penthouse features a spacious open-plan living area, complete with plush sofas, a large flat-screen TV, and an elegant dining table that seats six. The gourmet kitchen is fully equipped with state-of-the-art appliances, including a wine cooler, double oven, and an island with bar seating.</p>
                        
                        <p>The master suite is a true retreat, with a king-sized bed, a private balcony, and floor-to-ceiling windows that offer uninterrupted views of the city. The ensuite bathroom features a walk-in shower, a deep soaking tub, and double vanity sinks, all designed with a touch of luxury.</p>
                        
                        <p>Two additional bedrooms, each with its own en-suite bathroom, offer maximum privacy and comfort for your guests. Each bedroom is beautifully decorated with contemporary furnishings and high-end linens.</p>
                        
                        <p>On the rooftop terrace, you’ll find an outdoor dining area, a jacuzzi, and plenty of space for lounging in the sun. Whether you're entertaining guests or simply relaxing in style, this penthouse offers everything you could possibly need for a memorable stay.</p>
                        </div>""",

                """
                        <div>
                        <h2>Charming Cottage </h2>
                        <p>Escape the hustle and bustle of the city and enjoy the peaceful serenity of this charming lakeside cottage. Nestled right on the edge of a beautiful lake, this property offers an ideal getaway for those looking to relax and reconnect with nature.</p>
                        
                        <p>The cottage features a cozy living room with a fireplace, perfect for chilly nights. The open-plan kitchen comes fully equipped with a stove, oven, microwave, and all the utensils you’ll need to cook up a hearty meal. A dining table with seating for four makes it easy to enjoy meals together.</p>
                        
                        <p>The two bedrooms are furnished with comfortable queen-sized beds, and both offer views of the lake. The bathroom is simple but clean and functional, featuring a walk-in shower and fresh towels.</p>
                        
                        <p>Step outside onto the large deck, where you can enjoy your morning coffee while watching the sun rise over the water. The cottage also has a private dock where you can rent a canoe or kayak and explore the lake at your leisure.</p>
                        
                        <p>Whether you prefer fishing, hiking, or just unwinding in a hammock, this lakeside cottage offers a perfect retreat from everyday life.</p>
                        </div>""",

                """
                        <div>
                        <h2>Modern Loft in Industrial District</h2>
                        <p>This chic modern loft is located in the heart of the city's industrial district, blending urban style with comfort. Ideal for creative professionals or anyone who appreciates a minimalist aesthetic, this loft offers open spaces and contemporary design.</p>
                        
                        <p>The open-concept living area features large windows, exposed brick walls, and concrete floors, giving it an industrial vibe. The spacious lounge area is perfect for unwinding after a long day, with a cozy sofa and a flat-screen TV.</p>
                        
                        <p>The fully equipped kitchen has stainless steel appliances, including a dishwasher, a stovetop, a fridge, and a coffee maker. Whether you plan to cook your own meals or order in, this kitchen has everything you need.</p>
                        
                        <p>The loft’s sleeping area is separated by a stylish partition, with a queen-sized bed and an abundance of closet space. A large modern bathroom with a rain shower and sleek fixtures adds to the overall charm of the space.</p>
                        
                        <p>Located near popular restaurants, bars, and galleries, this loft offers a fantastic base for exploring the city’s vibrant culture. Public transport links are just a short walk away, making it easy to get around.</p>
                        </div>""",

                """
                        <div>
                        <h2>Chic 1-Bedroom Apartment with Garden Access</h2>
                        <p>Step into this chic and stylish 1-bedroom apartment, offering both comfort and convenience. Located in a quiet neighborhood, the apartment features a beautifully designed living space with access to a shared garden.</p>
                        
                        <p>The living room is tastefully furnished, with a comfortable sofa, a coffee table, and a smart TV. The dining area comfortably seats four, perfect for meals or evening cocktails with friends.</p>
                        
                        <p>The kitchen is fully equipped with modern appliances, including a stovetop, refrigerator, microwave, and dishwasher. Whether you are preparing a simple breakfast or a full dinner, you’ll have all the tools you need.</p>
                        
                        <p>The bedroom has a comfortable queen-sized bed, a spacious wardrobe, and stylish furnishings. The bathroom is sleek and modern, featuring a large walk-in shower and high-quality toiletries.</p>
                        
                        <p>The apartment’s most unique feature is its access to the beautiful shared garden, which provides a peaceful space to relax, read, or enjoy a meal outdoors. The neighborhood is quiet and residential, with parks and cafes within walking distance.</p>
                        </div>""",
                """
                        <div>
                        <h2>Spacious Family Home with Pool and Garden</h2>
                        <p>Ideal for families or large groups, this spacious home offers plenty of room for everyone to relax and enjoy their stay. Located in a serene suburban neighborhood, the property features a private pool, a well-maintained garden, and multiple outdoor seating areas.</p>
                        
                        <p>The house includes a large living room with a comfortable sectional sofa, a large flat-screen TV, and a fireplace for chilly evenings. The dining area is perfect for family meals, with seating for eight people.</p>
                        
                        <p>The kitchen is a chef’s dream, with top-of-the-line appliances, a double oven, a large fridge, and a dishwasher. There is also a breakfast nook with seating for four.</p>
                        
                        <p>The master bedroom has a king-sized bed and an ensuite bathroom with a soaking tub and walk-in shower. The three additional bedrooms are equally spacious and feature comfortable beds, ample closet space, and stylish decor.</p>
                        
                        <p>Step outside to the backyard, where you can enjoy the sunny weather by the pool, have a BBQ, or simply unwind in the garden. There’s also a large covered patio where you can dine al fresco.</p>
                        </div>""",

                """
                        <div>
                        <h2>Eco-Friendly Tiny House in the Countryside</h2>
                        <p>Get back to nature in this beautifully designed tiny house, located in the rolling hills of the countryside. Perfect for a weekend getaway or a peaceful retreat, this property offers an eco-friendly and minimalist lifestyle.</p>
                        
                        <p>The tiny house is surprisingly spacious, with a cleverly designed open-plan living area that includes a small kitchen, a fold-out table, and a comfy sofa. Large windows bring in plenty of natural light and allow you to enjoy the stunning views of the surrounding countryside.</p>
                        
                        <p>The sleeping area features a comfortable queen-sized bed with a view of the stars at night. The compact bathroom has a shower, a toilet, and eco-friendly amenities to minimize your carbon footprint.</p>
                        
                        <p>The outdoor space is just as impressive, with a small deck where you can relax and enjoy the tranquility of the surroundings. There’s also a fire pit for evening gatherings, perfect for roasting marshmallows and star-gazing.</p>
                        
                        <p>If you're looking for a sustainable, quiet retreat to reconnect with nature, this tiny house is the ideal escape.</p>
                        </div>""",

                """
                        <div>
                        <h2>Contemporary Home with Rooftop Terrace</h2>
                        <p>Live in style in this sleek, modern home that features a spacious layout, luxury amenities, and a private rooftop terrace with stunning views of the city skyline. Perfect for those looking for a mix of comfort and sophistication.</p>
                        
                        <p>The living room is designed for relaxation, with plush seating, a large flat-screen TV, and an open floor plan that leads directly into the dining area. The modern kitchen has state-of-the-art appliances, a wine fridge, and a large kitchen island for meal preparation.</p>
                        
                        <p>The bedrooms are spacious and beautifully furnished, with the master bedroom featuring a king-sized bed, a walk-in closet, and a private ensuite bathroom with a walk-in shower and a freestanding bathtub.</p>
                        
                        <p>Step outside to the rooftop terrace, where you can host a dinner party, lounge in the sun, or simply enjoy a glass of wine while taking in the panoramic views. The terrace is furnished with lounge chairs, a dining table, and even a small outdoor kitchen.</p>
                        
                        <p>This home offers both luxury and convenience, with easy access to restaurants, shops, and transportation links, making it the perfect base for exploring the city.</p>
                        </div>"""
        );

        return listTitle.get(index);
    }

    public String getHostReviewCustomer(int index){
        List<String> reviews = Arrays.asList(
                "The guest was fantastic! They were respectful, tidy, and left the place in perfect condition. Would love to host again!",
                "A pleasure to host. The guest communicated clearly and treated the apartment like their own. Highly recommend!",
                "The group was amazing! Very friendly, easygoing, and respectful of house rules. Welcome back anytime!",
                "An excellent guest. Very polite, clean, and respectful of the space. Would host again!",
                "The family was wonderful. They followed all the house rules and left the apartment spotless.",
                "Super easy to communicate with. The guest treated my home with great care. Would definitely host again.",
                "The guest and their friends were a joy to host. They were respectful and left the place in excellent condition.",
                "A great guest! Quiet, respectful, and left the apartment clean. Would host again any time.",
                "The family were great guests! They respected the property and left everything in great shape. Highly recommend!",
                "Very friendly, tidy, and considerate. It was a pleasure hosting them and I'd be happy to do it again!",
                "A dream guest. Communicated well, respected all the house rules, and left everything in perfect order.",
                "Such a lovely guest. Kept the place clean and was respectful of all the house rules. Would host again!",
                "The guest and their team were fantastic. They were respectful, friendly, and left the house in perfect condition.",
                "A wonderful guest. Very respectful, friendly, and left everything spotless. A pleasure to host!",
                "The guest was great, very communicative and respectful. Left the place spotless. Would definitely recommend!",
                "An ideal guest! Very friendly, clean, and respectful. Would host again in a heartbeat!",
                "The guest was a joy to host. They treated the space with respect and kept everything neat and tidy.",
                "The guest was a pleasure to host. They followed all the rules and left the apartment in pristine condition.",
                "The guest was fantastic. Very polite, great communicator, and treated the space with care.",
                "The group were wonderful guests. They were very respectful of the space and left everything in perfect shape.",
                "A perfect guest. Quiet, respectful, and very thoughtful. Left the house in perfect condition.",
                "A great guest. Communicated well, respected the space, and left everything tidy and clean.",
                "A fantastic guest. Very respectful, great communicator, and left everything spotless. Highly recommend!",
                "An ideal guest. They were quiet, polite, and very considerate. Left the house in perfect condition.",
                "Great guests! They communicated well, were respectful, and left the space in great condition.",
                "Very respectful, quiet, and treated the space with care. Would love to host again!",
                "An excellent guest. Polite, quiet, and took great care of the space. Highly recommend!",
                "A perfect guest. Communicated well, respected all house rules, and left the space in pristine condition.",
                "A pleasure to host. The guest communicated well, respected the space, and left everything tidy.",
                "The group was fantastic. Very considerate and left everything clean and tidy. Would host again!",
                "The guest was quiet, respectful, and took care of the apartment. Would host again in a heartbeat!",
                "The guest was a joy to host. Very respectful, clean, and kept the place immaculate. Highly recommend!",
                "The guest was fantastic. They were polite, clean, and easy to communicate with.",
                "The guest was very considerate. They left everything in great shape and were easy to communicate with.",
                "The guest and their friends were great. Very respectful of the space and left everything in great shape.",
                "A fantastic guest! They communicated well and treated the space with care.",
                "The guest was an ideal guest. Quiet, respectful, and kept the apartment neat and clean.",
                "A pleasure to host. The guest followed all the rules and kept the house in great condition.",
                "An amazing guest! Very respectful, treated the space with care, and left everything spotless.",
                "The guest was a joy to host. They communicated well, respected all the rules, and left the apartment in perfect condition.",
                "Great guest! Very quiet, tidy, and respectful of the space. Would love to host again!",
                "The guest was fantastic. Very polite, easy to communicate with, and treated the space with care.",
                "The guest was an excellent guest. They followed all house rules and kept everything clean and tidy.",
                "The guest was a wonderful guest. They treated the space with care, kept everything clean, and were respectful.",
                "The guest was fantastic. Quiet, respectful, and left the apartment in pristine condition.",
                "A great guest. Communicated well, treated the space with care, and left everything in excellent condition.",
                "An ideal guest. Very respectful and kept the house in great shape.",
                "The guest was fantastic. Quiet, clean, and very respectful of the house rules. Would host again!",
                "The guest was a perfect guest. Polite, respectful, and left the space spotless. Would host again!",
                "The guest was a great communicator and treated the space with great care. Highly recommend!",
                "The guest was wonderful to host. They were respectful, clean, and easy to communicate with.",
                "A pleasure to host. The guest was friendly, respectful, and kept everything in great shape.",
                "The guest was fantastic. They communicated well, treated the space with care, and kept everything clean.",
                "The guest was a great guest. Quiet, respectful, and kept the place immaculate.",
                "The guest was fantastic! They respected all the house rules, treated the space with care, and left everything clean.",
                "A perfect guest. They communicated well, followed all the rules, and left everything spotless.",
                "A wonderful guest. Very respectful, polite, and kept everything in great shape. Would host again!",
                "The guest was amazing. They communicated well and treated the space with respect.",
                "An ideal guest. Very respectful, quiet, and left the apartment in perfect condition.",
                "The guest was very respectful. Kept everything tidy, communicated well, and followed all the rules.",
                "The guest was great. They communicated well, followed the house rules, and treated the space with care.",
                "The guest was fantastic. Polite, respectful, and kept everything in perfect condition.",
                "The guest was a pleasure to host. They followed all the rules, kept everything neat, and were easy to communicate with.",
                "The guest was very considerate. They respected the space, followed the rules, and left everything clean.",
                "The guest was wonderful. They communicated well, were respectful, and treated the space with great care.",
                "The guest was great. Quiet, respectful, and kept everything in perfect condition.",
                "The guest was very respectful, clean, and easy to communicate with. Would host again!",
                "The guest was fantastic! Quiet, respectful, and left the place spotless. Would host again!",
                "The guest was a joy to host. Very respectful and kept the apartment in great shape.",
                "The guest was amazing. They communicated well and treated the space with care.",
                "The guest was a great guest. Quiet, respectful, and kept the apartment clean and tidy.",
                "The guest was a perfect guest. Quiet, respectful, and took care of the space. Would host again!",
                "The guest was fantastic. They were respectful, clean, and easy to communicate with.",
                "The guest was an ideal guest. They treated the space with respect, kept everything clean, and followed all the rules.",
                "The guest was wonderful. Very respectful, polite, and kept everything in great shape.",
                "The guest was an excellent guest. Very quiet, polite, and easy to communicate with.",
                "The guest was fantastic. Very respectful, quiet, and left everything clean and tidy.",
                "The guest was a great guest. They communicated well, followed the rules, and treated the space with care.",
                "The guest was a pleasure to host. Very respectful, tidy, and easy to communicate with.",
                "The guest was fantastic! They treated the space with care and left it in perfect condition.",
                "The guest was great. Quiet, respectful, and treated the space with respect. Would host again!",
                "The guest was an ideal guest. They were quiet, respectful, and kept everything in perfect condition.",
                "The guest was a joy to host. Very respectful and kept the apartment in great shape.",
                "The guest was amazing. They communicated well and treated the space with care.",
                "The guest was a great guest. Quiet, respectful, and kept the apartment clean and tidy.",
                "The guest was a perfect guest. Quiet, respectful, and took care of the space. Would host again!",
                "The guest was fantastic. They were respectful, clean, and easy to communicate with.",
                "The guest was an ideal guest. They treated the space with respect, kept everything clean, and followed all the rules.",
                "The guest was wonderful. Very respectful, polite, and kept everything in great shape.",
                "The guest was an excellent guest. Very quiet, polite, and easy to communicate with.",
                "The guest was fantastic. Very respectful, quiet, and left everything clean and tidy.",
                "The guest was a great guest. They communicated well, followed the rules, and treated the space with care.",
                "The guest was a pleasure to host. Very respectful, tidy, and easy to communicate with.",
                "The guest was fantastic! They treated the space with care and left it in perfect condition.",
                "The guest was great. Quiet, respectful, and treated the space with respect. Would host again!",
                "The guest was an ideal guest. They were quiet, respectful, and kept everything in perfect condition."
        );

        return reviews.get(index);
    }

    public String getCustomerReviewHost(int index){
        List<String> reviews = Arrays.asList(
                "The host was absolutely amazing! Very welcoming and provided everything I needed for a perfect stay.",
                "Had a wonderful stay! The host was very responsive and went above and beyond to ensure I was comfortable.",
                "The host was super friendly and made sure I had everything I needed. Highly recommend this place!",
                "Excellent experience. The host made sure I was well taken care of and provided great recommendations for the area.",
                "The host was so thoughtful, ensuring everything was perfect for my stay. I would love to return!",
                "Such a lovely host! Very attentive, accommodating, and made sure I felt at home. Would definitely stay again.",
                "Great communication with the host. They provided all the necessary information and made check-in easy.",
                "The host was extremely friendly and welcoming. The place was clean and well-equipped, making for a comfortable stay.",
                "Fantastic host! Very quick to respond and provided detailed instructions for everything. Felt very at ease here.",
                "The host made sure we were comfortable and even gave us a little tour of the area. Would love to return!",
                "The host was excellent. Very responsive and made sure everything was in place for a smooth check-in.",
                "A wonderful host! Very communicative and made sure we had everything we needed for our stay.",
                "The host was incredibly kind and provided thoughtful touches like extra towels and snacks. Highly recommend!",
                "The host was fantastic! Friendly, easy to communicate with, and very accommodating to all my needs.",
                "Loved staying here! The host was so hospitable and made sure I had everything for a comfortable stay.",
                "The host was amazing. They went out of their way to make sure my stay was perfect. Would definitely stay again!",
                "Such an accommodating host! Very responsive and made sure everything was set up perfectly for my stay.",
                "I had an amazing experience! The host was very welcoming and ensured that everything was perfect during my visit.",
                "The host was extremely helpful and made the stay very enjoyable. Definitely recommend this place!",
                "The host was wonderful! They were always available for any questions and made sure everything was perfect.",
                "Amazing host! Extremely welcoming and thoughtful. I felt right at home during my entire stay.",
                "The host was outstanding. Very accommodating and went above and beyond to ensure everything was perfect.",
                "Great host, very easy to communicate with, and the house was in excellent condition. I would love to stay again.",
                "Wonderful experience with the host. They were very helpful with local recommendations and made the stay very enjoyable.",
                "The host was fantastic. Very friendly, welcoming, and responsive. Would definitely recommend this place to anyone!",
                "The host was so helpful and easy to communicate with. They ensured everything was comfortable and well-organized.",
                "Had a great stay! The host was welcoming, helpful, and responsive. Highly recommended.",
                "The host was amazing! They gave us great local tips and ensured we had a fantastic time during our stay.",
                "The host was very communicative and made sure everything was perfect. Would stay again in a heartbeat!",
                "A wonderful host who provided everything I needed. They were very accommodating and went out of their way to ensure I was comfortable.",
                "The host was very welcoming and ensured we had everything we needed. Would love to come back!",
                "The host was incredibly helpful with local recommendations and was very quick to respond. A great experience overall.",
                "The host made us feel very welcome and ensured that everything was perfect for our stay. Highly recommend!",
                "I had a wonderful time staying at this place. The host was fantastic, welcoming, and helpful throughout my stay.",
                "Fantastic host! They were always available to assist and made sure my stay was comfortable.",
                "The host was fantastic! So attentive, responsive, and went out of their way to ensure I had everything I needed.",
                "The host was very accommodating, ensuring I had everything I needed. Would definitely recommend this place!",
                "I had a wonderful stay. The host made sure I had all the amenities I needed and was always available for questions.",
                "The host was very kind, and their home was beautiful. They went out of their way to make my stay special.",
                "The host was very welcoming and attentive. The place was exactly as described and very comfortable.",
                "The host was incredibly kind and made sure I had everything I needed. I would definitely recommend staying here!",
                "Very attentive host! They were always available when I had questions and made sure everything went smoothly.",
                "The host made sure I felt at home. They were very helpful and thoughtful throughout my entire stay.",
                "The host was amazing! Very kind and went out of their way to ensure I had a great experience.",
                "The host was so welcoming and friendly. The place was exactly as described, and the check-in was smooth.",
                "The host was fantastic! They gave me great tips on things to do in the area and made sure I had everything I needed.",
                "The host was very responsive and ensured that I had everything I needed. The apartment was clean and well-organized.",
                "A great host who made sure everything was taken care of. Very easy to communicate with and extremely helpful.",
                "The host was very friendly, and they gave great local tips. The place was perfect for my stay.",
                "Wonderful host! They provided a welcoming atmosphere and were very accommodating during my entire stay.",
                "The host was very helpful, providing local recommendations and always being available for questions. Highly recommend!",
                "The host was wonderful and made sure we had everything we needed. Would definitely recommend this place!",
                "The host was very hospitable and made sure the entire stay was smooth and enjoyable.",
                "The host was exceptional! Very communicative, and they provided all the info needed for a great stay.",
                "Great host! They responded quickly and made sure everything was in perfect order for my stay.",
                "The host was amazing. Super friendly, easy to communicate with, and very attentive. Highly recommended!",
                "Had a fantastic stay! The host was very kind, offered great local tips, and made sure everything was perfect.",
                "The host was very responsive and ensured everything was perfect for my stay. I would love to stay again.",
                "The host was welcoming and easy to communicate with. The place was exactly as described, and everything was perfect.",
                "The host was outstanding! They ensured that everything was well-organized and that I had everything I needed.",
                "Such a wonderful host! They made sure I had all the information I needed and that I was comfortable the entire stay.",
                "The host was so accommodating and friendly! They ensured I had a great experience and made the check-in process easy.",
                "The host was very responsive and provided great recommendations for things to do nearby. Highly recommend staying here!",
                "The host was amazing. Very easy to communicate with and made sure everything went smoothly.",
                "The host was wonderful. Very friendly, responsive, and went out of their way to make sure I had everything I needed.",
                "The host made sure everything was perfect for my stay. They were easy to communicate with and very accommodating.",
                "The host was very thoughtful and ensured everything was perfect. Would absolutely stay here again.",
                "The host was amazing! They were very welcoming and provided helpful local tips that made the stay even better.",
                "The host was very kind and ensured everything was smooth during my stay. Would definitely stay again!",
                "Fantastic host! Extremely welcoming, responsive, and went out of their way to ensure everything was perfect.",
                "The host was extremely helpful and provided all the information I needed for a seamless stay.",
                "The host was incredibly kind and attentive. The apartment was well-equipped and perfect for my stay.",
                "The host was wonderful. They communicated well, and the place was just as described. Highly recommended!",
                "The host was very attentive and made sure everything was great during my stay. Highly recommend!",
                "Had a fantastic experience! The host made sure I had everything I needed and was very communicative.",
                "The host was wonderful, making sure I was comfortable and had all the information I needed. Would love to return!",
                "The host was incredibly welcoming and made sure I had everything I needed. Highly recommend staying here.",
                "Such a great host! Very accommodating and easy to communicate with. I had an amazing stay.",
                "The host was incredibly helpful and ensured everything was perfect. Would definitely stay here again!",
                "The host was amazing! They went out of their way to make sure I had a fantastic stay. Would highly recommend!",
                "The host was fantastic! Very helpful and friendly, ensuring I had everything I needed for a comfortable stay.",
                "The host was extremely kind and made sure I had everything I needed for my stay. Highly recommend!",
                "Wonderful host! Made sure I was comfortable and provided helpful information about the area.",
                "The host was amazing. Very friendly, quick to respond, and made sure everything was perfect during my stay.",
                "The host was incredibly accommodating. They made sure my stay was comfortable and seamless from start to finish.",
                "The host was very welcoming and responsive. Would definitely recommend this place to others!",
                "The host was extremely thoughtful, ensuring I had everything I needed. Would definitely stay here again!",
                "The host was very friendly, easy to communicate with, and made sure I had everything I needed for a great stay.",
                "The host was fantastic. They provided great local recommendations and ensured everything went smoothly during my stay.",
                "The host was great! Very responsive and made sure I had everything I needed for my stay. Highly recommended!",
                "Had a great experience! The host was very friendly and made sure I had all the information I needed."
        );

        return reviews.get(index);
    }

    public String getSelfCheckInInstruction(){
        return """
                <h1>Welcome to Your Stay!</h1>
                <p>Please follow the instructions below for a smooth self check-in.</p>
                <h2>1. Arrival Instructions</h2>
                <p>Upon arriving at the property, head towards the main entrance.</p>
                <ul>
                    <li>Address: 1234 Main Street, Suite 101, City, State, ZIP</li>
                    <li>Look for the door with the lockbox on the left side of the entrance.</li>
                </ul>
                <h2>2. Lockbox Access</h2>
                <p>The lockbox will contain your key. To open it:</p>
                <ol>
                    <li>Enter the code provided in your check-in message.</li>
                    <li>Turn the dial to the right to open the box.</li>
                    <li>Remove your key and ensure the lockbox is securely closed before proceeding.</li>
                </ol>
                <h2>3. Entering Your Room</h2>
                <p>Once inside, head directly to your assigned room.</p>
                <ul>
                    <li>Room number: 101</li>
                    <li>Use the key to unlock the door to your room.</li>
                </ul>
                <h2>4. Need Assistance?</h2>
                <p>If you encounter any issues during your check-in or stay, feel free to reach out:</p>
                <ul>
                    <li>Phone: +1 234-567-8900</li>
                    <li>Email: support@yourproperty.com</li>
                </ul>
                <p>Enjoy your stay and feel free to contact us if you have any questions.</p>
                """;
    }
}
