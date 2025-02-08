package com.service.main.service.customer;

import com.service.main.dto.CustomResult;
import com.service.main.dto.DisputeRequestDto;
import com.service.main.entity.BookingDispute;
import com.service.main.repository.BookingDisputeDetailRepository;
import com.service.main.repository.BookingDisputeRepository;
import com.service.main.repository.BookingRepository;
import com.service.main.service.ImageUploadingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class DisputeCMService {

    @Autowired
    private BookingDisputeRepository bookingDisputeRepository;

    @Autowired
    private BookingDisputeDetailRepository bookingDisputeDetailRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ImageUploadingService imageUploadingService;


    public boolean checkIfReportable(Date checkIn) {
        Calendar now = Calendar.getInstance();
        now.set(Calendar.HOUR_OF_DAY, 0);
        now.set(Calendar.MINUTE, 0);
        now.set(Calendar.SECOND, 0);
        now.set(Calendar.MILLISECOND, 0);
        Date currentDate = now.getTime();

        Calendar checkInCalendar = Calendar.getInstance();
        checkInCalendar.setTime(checkIn);
        checkInCalendar.set(Calendar.HOUR_OF_DAY, 0);
        checkInCalendar.set(Calendar.MINUTE, 0);
        checkInCalendar.set(Calendar.SECOND, 0);
        checkInCalendar.set(Calendar.MILLISECOND, 0);
        Date checkInDate = checkInCalendar.getTime();

        long differenceInMillis = currentDate.getTime() - checkInDate.getTime();

        return differenceInMillis <= 172800000;
    }


    public CustomResult reportBooking(DisputeRequestDto disputeRequestDto) {
        try {


            var booking = bookingRepository.findBookingById(disputeRequestDto.getBookingId());

            if (booking == null) {
                return new CustomResult(404, "Not found booking", null);
            }

            if(!checkIfReportable(booking.getCheckInDay())){
                return new CustomResult(403, "This booking exceed time limit", null);
            }

            var newDispute = new BookingDispute();
            newDispute.setBooking(booking);
            newDispute.setStatus("PENDING");
            newDispute.setReason(disputeRequestDto.getReason());

            List<String> imagesList = disputeRequestDto.getImages().stream().map(multipartFile -> imageUploadingService.upload(multipartFile)).toList();
            ;

            newDispute.setImages(String.join(",", imagesList));
            bookingDisputeRepository.save(newDispute);
            booking.setStatus("DISPUTED");
            bookingRepository.save(booking);

            return new CustomResult(200, "OK", null);
        } catch (Exception e) {
            return new CustomResult(400, e.getMessage(), null);
        }
    }
}
