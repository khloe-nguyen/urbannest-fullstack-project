package com.service.main.service.customer;

import com.service.main.dto.CustomPaging;
import com.service.main.dto.CustomResult;
import com.service.main.dto.NotificationResponseDto;
import com.service.main.entity.Notification;
import com.service.main.repository.NotificationRepository;
import com.service.main.repository.UserRepository;
import com.service.main.service.PagingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationCMService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PagingService pagingService;

    public CustomResult getUserPopUpNotification(String email) {
        try{
            var user = userRepository.findUserByEmail(email);

            if(user == null) {
                return new CustomResult(404, "Not found", null);
            }

            var notifications = notificationRepository.findUserPopUpNotification(user.getId());

            return new CustomResult(200, "Success", notifications);
        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }

    public CustomPaging getCustomerNotification(int pageNumber, int pageSize, String email, Boolean status){
        try{
            var user = userRepository.findUserByEmail(email);

            if(user == null){
                var customPaging = new CustomPaging();
                customPaging.setStatus(404);
                customPaging.setMessage("Not found");
                return customPaging;
            }
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());

            var notificationPage = notificationRepository.findByUserId(user.getId(), status,pageable);

            var customPaging = pagingService.convertToCustomPaging(notificationPage, pageNumber, pageSize);

            List<NotificationResponseDto> notifcations = new ArrayList<>();

            for(var notification : (List<Notification>) customPaging.getData()){
                var notifcationDto = new NotificationResponseDto();
                BeanUtils.copyProperties(notification, notifcationDto);

                notifcations.add(notifcationDto);
            }

            customPaging.setData(notifcations);

            return customPaging;

        }catch (Exception e){
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(e.getMessage());
            return customPaging;
        }
    }

    public CustomResult changeNotificationReadStatus(int notificationId){
        try{

            var notification = notificationRepository.findById(notificationId);

            if(notification.isEmpty()){
                return new CustomResult(404, "Notification not exist!", null);
            }

            notification.get().setRead(true);

            notificationRepository.save(notification.get());

            return new CustomResult(200, "OK", null);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }


    public CustomResult removeNotification(int notificationId){
        try{

            var notification = notificationRepository.findById(notificationId);

            if(notification.isEmpty()){
                return new CustomResult(404, "Notification not exist!", null);
            }

            notificationRepository.delete(notification.get());

            return new CustomResult(200, "OK", null);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }


}
