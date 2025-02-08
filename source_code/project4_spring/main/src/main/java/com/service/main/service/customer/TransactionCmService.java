package com.service.main.service.customer;

import com.service.main.dto.CustomResult;
import com.service.main.dto.PushNotificationDto;
import com.service.main.dto.TransactionDto;
import com.service.main.entity.Notification;
import com.service.main.entity.Transaction;
import com.service.main.repository.BookingRepository;
import com.service.main.repository.NotificationRepository;
import com.service.main.repository.TransactionRepository;

import java.util.Date;
import java.util.HashMap;

import com.service.main.service.FirebaseMessagingService;
import com.service.main.service.FirebaseRealTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionCmService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TransactionRepository transactionRepository;


    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private FirebaseMessagingService firebaseMessagingService;

    @Autowired
    private FirebaseRealTimeService firebaseRealTimeService;

    @Transactional
    public CustomResult createTransaction(TransactionDto transactionDto) {

        var bookingOptional = bookingRepository.findById(transactionDto.getBookingId());
        if (bookingOptional.isEmpty()) {
            return new CustomResult(404, "Booking not found", null);
        }

        var booking = bookingOptional.get();
        var transaction = new Transaction();
        if ("TRANSACTIONPENDDING".equals(booking.getStatus())) {

            transaction.setBooking(booking);
            transaction.setAmount(transactionDto.getAmount());
            transaction.setUser(booking.getCustomer());
            transaction.setTransactionType("escrow");
            transaction.setTransferOn(new Date());
            transactionRepository.save(transaction);

            if(booking.getBookingType().equals("reserved")){
                booking.setStatus("PENDING");
            }else{
                booking.setStatus("ACCEPT");
            }

            bookingRepository.save(booking);

            var newNotification = new Notification();
            newNotification.setUser(booking.getProperty().getUser());
            newNotification.setCreatedAt(new Date());
            newNotification.setRead(false);
            newNotification.setUrl("/hosting");
            newNotification.setMessage(String.format("Customer with an email %s has book your property, please check and review, if you need anything please contact the admin",booking.getProperty().getUser().getEmail()));
            notificationRepository.save(newNotification);


            var pushNotification = new PushNotificationDto();
            pushNotification.setImage((booking.getCustomer().getAvatar() != null ? booking.getCustomer().getAvatar() : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"));
            pushNotification.setBody("Customer has book your property please check for notification for more detail");
            pushNotification.setSubject("New booking of your property");
            pushNotification.setData(new HashMap<String, String>());
            pushNotification.setUserId(booking.getProperty().getUser().getId());

            firebaseMessagingService.sendNotificationToUser(pushNotification);


            var webKey = String.format("notification_%d_web", booking.getProperty().getUser().getId());
            var phoneKey = String.format("notification_%d_phone", booking.getProperty().getUser().getId());
            var bodyMessage = new HashMap<String, String>();
            bodyMessage.put("message", "Customer has book your property please check for notification for more detail");
            bodyMessage.put("mobile", "false");
            bodyMessage.put("web", "false");

            firebaseRealTimeService.writeData(webKey, bodyMessage);
            firebaseRealTimeService.writeData(phoneKey, bodyMessage);

            if(booking.getBookingType().equals("instant")) {
                var webPropertyKey = String.format("property_%d_web", booking.getProperty().getId());
                var phonePropertyKey = String.format("property_%d_phone", booking.getProperty().getId());
                var bodyPropertyMessage = new HashMap<String, String>();
                bodyMessage.put("message", "This property calendar has updated please upload to updated new calendar");
                bodyMessage.put("time", new Date().toString());
                firebaseRealTimeService.writeData(webPropertyKey, bodyPropertyMessage);
                firebaseRealTimeService.writeData(phonePropertyKey, bodyPropertyMessage);
            }


            return new CustomResult(200, "Transaction success", transaction);
        }
        return new CustomResult(400,
                "The transaction failed because it had already been successfully paid for.", null);

    }
}
