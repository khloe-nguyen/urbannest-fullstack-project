package com.service.main.controller;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.service.chat.dto.PushNotificationDto;
import com.service.main.repository.BookingRepository;
import com.service.main.repository.UserRepository;
import com.service.main.service.FirebaseMessagingService;
import com.service.main.service.ImageUploadingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("test")
public class TestController {

    @Autowired
    private ImageUploadingService imageUploadingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FirebaseMessagingService firebaseMessagingService;

    @PostMapping
    public ResponseEntity<List<String>> uploadImage(List<MultipartFile> files) {

        List<String> images = files.stream().map((file) -> {
            return imageUploadingService.upload(file);
        }).toList();

        List<Integer> t = new ArrayList<>() ;

        return ResponseEntity.ok(images);
    }

    @GetMapping("test_expire_reserved")
    public ResponseEntity<?> expireReserved() {
        return ResponseEntity.ok(bookingRepository.getExpiredReservationBooking(new Date()));
    }

    @GetMapping("test_payment_ready")
    public ResponseEntity<?> paymentReady() {
        return ResponseEntity.ok(bookingRepository.getReadyToFinishPayment(new Date()));
    }

    @GetMapping("test_test")
    public int testestest() {
        return userRepository.countUser();
    }


    @PostMapping("test_send")
    public void testNotification() throws FirebaseMessagingException {
        Map<String, String> test = new HashMap<>();
        test.put("a", "a");
        test.put("b", "b");
        String token = "f_CBgaRZS4GHgN51kLw5th:APA91bGWh5DEiVizwa3Db4sIhaWvNL6p86wNzll2sdeBRYIHUTdJ8JErhiiwc5l63OJJUiUmyh2lPV6U100GtK8879Tb68WOGlxIBmIhkvCW8e9jhjRtzMw";

        PushNotificationDto pushNotificationDto = new PushNotificationDto();
        pushNotificationDto.setImage("https://firebasestorage.googleapis.com/v0/b/eproject4-3c13d.appspot.com/o/56d2d47b-6554-4c68-9f9b-ad99fe82707c.png?alt=media");
        pushNotificationDto.setBody("body");
        pushNotificationDto.setSubject("subject");
        pushNotificationDto.setData(test);
        pushNotificationDto.setToken(token);

    }
}
