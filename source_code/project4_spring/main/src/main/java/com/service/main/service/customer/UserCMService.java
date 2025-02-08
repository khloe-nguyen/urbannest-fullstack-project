package com.service.main.service.customer;


import com.service.main.dto.*;
import com.service.main.dto.userDto.request.*;
import com.service.main.dto.userDto.response.*;
import com.service.main.entity.*;
import com.service.main.repository.PropertyRepository;
import com.service.main.repository.ReviewRepository;
import com.service.main.repository.UserDocumentImageRepository;
import com.service.main.repository.UserRepository;
import com.service.main.service.ImageUploadingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserCMService {

    @Autowired
    private UserDocumentImageRepository _userDocumentImageRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ImageUploadingService _imageUploadingService;

    public UserInfoDto getUserInfoById(int userId){
        try{
            var user = userRepository.findById(userId);

            if(user.isEmpty()){
                return null;
            }

            var userInfoDto = new UserInfoDto();

            userInfoDto.setId(user.get().getId());
            userInfoDto.setFirstName(user.get().getFirstName());
            userInfoDto.setLastName(user.get().getLastName());
            userInfoDto.setAvatar(user.get().getAvatar());
            return userInfoDto;
        }catch (Exception e){
            return null;
        }
    }


    public CustomResult getUserPersonalById(int userId){
        try{
            var user = userRepository.findById(userId).orElse(null);

            if(user == null){
                return new CustomResult(404, "Not found", null);
            }

            var userAuthDto = new UserPersonalInfoDto();
            BeanUtils.copyProperties(user, userAuthDto);

            List<BadgeDto> badges = new ArrayList<>();

            for(var badge : user.getUserBadges()){
                var newBadgeDto = new BadgeDto();
                newBadgeDto.setId(badge.getBadge().getId());
                newBadgeDto.setName(badge.getBadge().getName());
                newBadgeDto.setDescription(badge.getBadge().getDescription());
                badges.add(newBadgeDto);
            }

            userAuthDto.setBadgeList(badges);
            userAuthDto.setHost(!user.getProperties().isEmpty());

            var properties = propertyRepository.findListingByUserId(userId);

            List<PropertyHomePageDto> propertiesDtoList = new ArrayList<>();

            for(var property : properties){
                if(!property.getStatus().equals("PUBLIC")){
                    continue;
                }
                var newPropertyDto = new PropertyHomePageDto();
                BeanUtils.copyProperties(property, newPropertyDto);

                List<String> images = new ArrayList<>();

                for(var image : property.getPropertyImages()) {
                    images.add(image.getImageName());
                }
                newPropertyDto.setPropertyImages(images);
                propertiesDtoList.add(newPropertyDto);

            }

            userAuthDto.setListProperties(propertiesDtoList);


            var reviews = reviewRepository.getUserReviewedByOther(userId);

            List<ReviewMinimizeDto> reviewMinimizeDtoList = new ArrayList<>();

            for(var review : reviews){
                var newReviewDto = new ReviewMinimizeDto();

                BeanUtils.copyProperties(review, newReviewDto);

                newReviewDto.setUser(new UserDto());
                newReviewDto.getUser().setFirstName(review.getUser().getFirstName());
                newReviewDto.getUser().setLastName(review.getUser().getLastName());
                newReviewDto.getUser().setAvatar(review.getUser().getAvatar());
                reviewMinimizeDtoList.add(newReviewDto);
            }

            userAuthDto.setListReviews(reviewMinimizeDtoList);

            return new CustomResult(200, "Success", userAuthDto);

        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }

    public CustomResult searchUserForGroupChat(int userId, String search){
        try{
            var users = userRepository.searchUserGroupChat(userId, search);

            List<UserInfoDto> userInfoDtos = new ArrayList<>();

            for (var user : users) {
                var userInfoDto = new UserInfoDto();
                userInfoDto.setId(user.getId());
                userInfoDto.setFirstName(user.getFirstName());
                userInfoDto.setLastName(user.getLastName());
                userInfoDto.setAvatar(user.getAvatar());
                userInfoDto.setEmail(user.getEmail());
                userInfoDtos.add(userInfoDto);
            }

            return new CustomResult(200, "Success", userInfoDtos);

        }catch (Exception e){
            return new CustomResult(400, "Bad request", e.getMessage());
        }
    }

    public List<UserInfoDto> searchForUser(int userId, String search, List<Long> friendsId){
        try{

            var users = userRepository.searchChatUser(search, userId, friendsId);

            List<UserInfoDto> userInfoDtos = new ArrayList<>();

            for (var user : users) {
                var userInfoDto = new UserInfoDto();
                userInfoDto.setId(user.getId());
                userInfoDto.setFirstName(user.getFirstName());
                userInfoDto.setLastName(user.getLastName());
                userInfoDto.setAvatar(user.getAvatar());
                userInfoDto.setEmail(user.getEmail());
                userInfoDtos.add(userInfoDto);
            }

            return userInfoDtos;
        }catch (Exception e){
            return null;
        }
    }

    public ResponseEntity<CustomResult> putLegalName(LegalNameRequest request){
        CustomResult result = new CustomResult();
        try {
            // Change mock after
            String mockEmail = "bigmouth3033@gmail.com";
            var email = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findUserByEmail(email);
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user = userRepository.save(user);

            LegalNameResponse response = new LegalNameResponse();
            response.setFirstName(user.getFirstName());
            response.setLastName(user.getLastName());

            result.setStatus(200);
            result.setMessage("Update Legal Success");
            result.setData(response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.setStatus(400);
            result.setMessage("Something went wrong while update LegalName");
            result.setData(null);
            return ResponseEntity.badRequest().body(result);
        }
    }

    public ResponseEntity<CustomResult> putPreferredName(PreferredNameRequest request){
        CustomResult result = new CustomResult();
        try {
            // Change mock after
            String mockEmail = "bigmouth3033@gmail.com";
            var email = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findUserByEmail(email);
            user.setPreferredName(request.getPreferredName());
            user = userRepository.save(user);

            PreferredNameResponse response = new PreferredNameResponse();
            response.setPreferredName(user.getPreferredName());

            result.setStatus(200);
            result.setMessage("Update Preferred Success");
            result.setData(response);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.setStatus(400);
            result.setMessage("Something went wrong while update LegalName");
            result.setData(null);
            return ResponseEntity.badRequest().body(result);
        }
    }

    public ResponseEntity<CustomResult> putPhoneNumber(PhoneNumberRequest request){
        CustomResult result = new CustomResult();
        try {
            // Change mock after
            String mockEmail = "bigmouth3033@gmail.com";
            var email = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findUserByEmail(email);
            user.setPhoneNumber(request.getPhoneNumber());
            user = userRepository.save(user);

            PhoneNumberResponse phoneNumberResponse = new PhoneNumberResponse();
            phoneNumberResponse.setPhoneNumber(user.getPhoneNumber());

            result.setStatus(200);
            result.setMessage("Update Preferred Success");
            result.setData(phoneNumberResponse);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.setStatus(400);
            result.setMessage("Something went wrong while update LegalName");
            result.setData(null);
            return ResponseEntity.badRequest().body(result);
        }
    }
    public ResponseEntity<CustomResult> putGovernment(GovernmentRequest request){
        CustomResult result = new CustomResult();
        try {
            // Change mock after
            String mockEmail = "bigmouth3033@gmail.com";

            var email = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findUserByEmail(email);
            var frontImageUrl = _imageUploadingService.upload(request.getFrontImage());
            var backImageUrl = _imageUploadingService.upload(request.getBackImage());

            // update DriverLicense
            if (request.getIdType() == 1) {
                user.setDriverLicenseFrontUrl(frontImageUrl);
                user.setDriverLicenseBackUrl(backImageUrl);
                user.setDriverLicenseCountry(request.getGovernmentCountry());
            }
            // update IdentityCard
            if (request.getIdType() == 2) {
                user.setIdentityCardFrontUrl(frontImageUrl);
                user.setIdentityCardBackUrl(backImageUrl);
                user.setIdentityCardCountry(request.getGovernmentCountry());
            }
            userRepository.save(user);

            GovernmentResponse governmentResponse = new GovernmentResponse();
            governmentResponse.setIdType(request.getIdType());
            governmentResponse.setFrontImageUrl(frontImageUrl);
            governmentResponse.setBackImageUrl(backImageUrl);
            governmentResponse.setGovernmentCountry(request.getGovernmentCountry());
            result.setStatus(200);
            result.setMessage("Update Government Success");
            result.setData(governmentResponse);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.setStatus(400);
            result.setMessage("Some thing went wrong while update Government");
            result.setData(null);
            return ResponseEntity.badRequest().body(result);

        }
    }
    public ResponseEntity<CustomResult> putAddress(AddressRequest request){
        CustomResult result = new CustomResult();
        try {
            var email = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findUserByEmail(email);
            user.setAddress(request.getAddress());
            userRepository.save(user);

            AddressResponse addressResponse = new AddressResponse();
            addressResponse.setAddress(user.getAddress());

            result.setStatus(200);
            result.setMessage("Update Preferred Success");
            result.setData(addressResponse);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.setStatus(400);
            result.setMessage("Something went wrong while update Address");
            result.setData(null);
            return ResponseEntity.badRequest().body(result);
        }
    }
    public ResponseEntity<CustomResult> putCheckOtp(OtpConfirmRequest request){
        CustomResult result = new CustomResult();
        try {
            var email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findUserByEmail(email);

            if (user.getOTP().equals(request.getOtp())) {
                if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
                    result.setStatus(404);
                    result.setMessage("Otp expired");
                    result.setData(null);
                    return ResponseEntity.ok(result);
                }

                String newPassword = user.getNewPassword();
                user.setPassword(newPassword);
                userRepository.save(user);

                result.setStatus(200);
                result.setMessage("Update Password Success");
                result.setData(null);
                return ResponseEntity.ok(result);
            } else {
                result.setStatus(404);
                result.setMessage("Otp doesn't exist");
                result.setData(null);
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            result.setStatus(400);
            result.setMessage("Some thing went wrong while check Otp");
            result.setData(null);
            return ResponseEntity.badRequest().body(result);
        }
    }
    public ResponseEntity<CustomResult> putAvatar(AvatarOptionRequest request){
        CustomResult result = new CustomResult();
        try {
            // Change mock later
            String mockEmail = "bigmouth3033@gmail.com";
            var email = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findUserByEmail(email);
            String avatarUrl = _imageUploadingService.upload(request.getAvatarFileImage());
            if (request.getAvatarOption().equals("1")) {
                user.setAvatar(avatarUrl);
                userRepository.save(user);
                result.setStatus(200);
                result.setMessage("Update Avatar Success");
                result.setData(null);
                return ResponseEntity.ok(result);
            }
            if (request.getAvatarOption().equals("2")) {
                user.setRealAvatar(avatarUrl);
                userRepository.save(user);
                result.setStatus(200);
                result.setMessage("Update Personal Avatar Success");
                result.setData(null);
                return ResponseEntity.ok(result);
            }

            result.setStatus(204);
            result.setMessage("No Operation");
            result.setData(null);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.setStatus(400);
            result.setMessage("Some thing went wrong while update Avatar");
            result.setData(null);
            return ResponseEntity.badRequest().body(result);
        }
    }
    public ResponseEntity<CustomResult> getUserRefill(){
        CustomResult result = new CustomResult();
        try {
            var email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findUserByEmail(email);
            UserRefillResponse response = new UserRefillResponse();


            if (user.getAddress() != null && !user.getAddress().isEmpty()) {
                response.getMessage().add("Address");
                response.setProgress(response.getProgress() + 1);

            }
            if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
                response.getMessage().add("Phone Number");
                response.setProgress(response.getProgress() + 1);
            }
            if (user.getRealAvatar() != null && !user.getRealAvatar().isEmpty()) {
                response.getMessage().add("Real Avatar");
                response.setProgress(response.getProgress() + 1);
            }
            if (user.getIdentityCardFrontUrl() != null && !user.getIdentityCardFrontUrl().isEmpty() && user.getIdentityCardBackUrl() != null && !user.getIdentityCardBackUrl().isEmpty()) {
                response.getMessage().add("Identity");
                response.setProgress(response.getProgress() + 1);
            }
            if (user.getDriverLicenseFrontUrl() != null && !user.getDriverLicenseFrontUrl().isEmpty() && user.getDriverLicenseBackUrl() != null && !user.getDriverLicenseBackUrl().isEmpty()) {
                response.getMessage().add("Driver License");
                response.setProgress(response.getProgress() + 1);
            }
            response.setComplete(response.getProgress() == 5);

            result.setStatus(200);
            result.setData(response);
            result.setMessage("");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.setStatus(400);
            result.setData(null);
            result.setMessage("Some thing wrong when get user refill");
            return ResponseEntity.ok(result);
        }
    }
    public ResponseEntity<CustomResult> postUserRefill(){
        CustomResult result = new CustomResult();
        try {
            var email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findUserByEmail(email);
            UserDocumentImage userDocumentImage = _userDocumentImageRepository.findByUser(user);

            if (userDocumentImage == null) {
                userDocumentImage = new UserDocumentImage();
                userDocumentImage.setCreateDate(LocalDateTime.now());
                userDocumentImage.setUpdateDate(LocalDateTime.now());
            }


            userDocumentImage.setUser(user);
            userDocumentImage.setAddress(user.getAddress());
            userDocumentImage.setPhoneNumber(user.getPhoneNumber());
            userDocumentImage.setRealAvatar(user.getRealAvatar());
            userDocumentImage.setIdentityCardFrontUrl(user.getIdentityCardFrontUrl());
            userDocumentImage.setIdentityCardBackUrl(user.getIdentityCardBackUrl());
            userDocumentImage.setDriverLicenseFrontUrl(user.getDriverLicenseFrontUrl());
            userDocumentImage.setDriverLicenseBackUrl(user.getDriverLicenseBackUrl());
            userDocumentImage.setStatus("PENDING");
            userDocumentImage.setUpdateDate(LocalDateTime.now());
            _userDocumentImageRepository.save(userDocumentImage);
            result.setStatus(200);
            result.setMessage("Your upgrade request has been sent");
            result.setData(null);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.setStatus(404);
            result.setMessage("Something went wrong when send you upgrade request");
            result.setData(null);
            return ResponseEntity.ok(result);
        }
    }

}
