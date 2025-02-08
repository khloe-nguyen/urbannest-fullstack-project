package com.service.main.service.admin;


import com.service.main.dto.AdminForgotPasswordNotification;
import com.service.main.dto.CustomPaging;
import com.service.main.dto.CustomResult;
import com.service.main.dto.NotificationResponseDto;
import com.service.main.entity.Notification;
import com.service.main.entity.NotificationAdmin;
import com.service.main.repository.AdminRepository;
import com.service.main.repository.NotificationAdminRepository;
import com.service.main.repository.NotificationRepository;
import com.service.main.service.PagingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class NotificationADService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private NotificationAdminRepository notificationRepository;

    @Autowired
    private PagingService pagingService;




    public CustomResult notificationForgotPassword(AdminForgotPasswordNotification adminForgotPasswordNotification){
        try{
            var employee = adminRepository.findByEmail(adminForgotPasswordNotification.getEmail());

            if(employee == null){
                return new CustomResult(404, "Account not exist!", null);
            }

            var employees = adminRepository.findAdminAndSpecificRole("EMPLOYEE_MANAGEMENT");

            for(var employeeReceived: employees){
                var newNotification = new NotificationAdmin();
                newNotification.setAdmin(employeeReceived);
                    newNotification.setMessage(String.format("Employee with name %s and email %s request new password please check carefully and reset their password is needed", employee.getFirstName() + " " + employee.getLastName(), employee.getEmail()));
                newNotification.setCreatedAt(new Date());
                newNotification.setUrl(String.format("/admin/employee_list?search=%s", employee.getEmail()));
                newNotification.setRead(false);

                notificationRepository.save(newNotification);
            }
            return new CustomResult(200, "OK", null);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
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

    public CustomPaging getAdminNotification(int pageNumber, int pageSize, String email, Boolean status){
        try{
            var employee = adminRepository.findByEmail(email);

            if(employee == null){
                var customPaging = new CustomPaging();
                customPaging.setStatus(404);
                customPaging.setMessage("Not found");
                return customPaging;
            }

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());

            var notificationPage = notificationRepository.findByUserId(employee.getId(), status,pageable);

            var customPaging = pagingService.convertToCustomPaging(notificationPage, pageNumber, pageSize);

            List<NotificationResponseDto> notifcations = new ArrayList<>();

            for(var notification : (List<NotificationAdmin>) customPaging.getData()){
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
}
