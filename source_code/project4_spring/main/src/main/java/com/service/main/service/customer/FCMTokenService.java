package com.service.main.service.customer;

import com.service.main.dto.CustomResult;
import com.service.main.dto.FCMTokenDto;
import com.service.main.entity.FCMToken;
import com.service.main.repository.FCMTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FCMTokenService {

    @Autowired
    private FCMTokenRepository fcmTokenRepository;

    public CustomResult saveFCMToken(FCMTokenDto fcmTokenDto) {
        try{
            var fcmToken = new FCMToken();
            fcmToken.setFCMToken(fcmToken.getFCMToken());
            fcmToken.setUserId(fcmTokenDto.getUserId());
            fcmTokenRepository.save(fcmToken);

            return new CustomResult(200, "Success", null);
        }catch (Exception e){
            return new CustomResult(400, "Bad request", null);
        }
    }

    public CustomResult deleteFCMToken(FCMTokenDto fcmTokenDto ) {
        try{
            FCMToken token =  fcmTokenRepository.findFCMTokensByFCMTokenAndUserId(fcmTokenDto.getToken(), fcmTokenDto.getUserId());

            if(token != null){
                fcmTokenRepository.delete(token);
            }

            return new CustomResult(200, "Success", null);
        }catch (Exception e){
            return new CustomResult(400, "Bad request", null);
        }
    }
}
