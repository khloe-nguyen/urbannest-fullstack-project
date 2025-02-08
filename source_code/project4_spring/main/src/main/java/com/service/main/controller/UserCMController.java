package com.service.main.controller;

import com.service.main.dto.*;
import com.service.main.entity.*;
import com.service.main.repository.BadgeRepository;
import com.service.main.repository.UserBadgeRepository;
import com.service.main.repository.UserDocumentImageRepository;
import com.service.main.service.PagingService;
import com.service.main.service.customer.UserCMService;
import org.modelmapper.internal.bytebuddy.asm.Advice;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.service.main.dto.userDto.request.*;
import com.service.main.dto.userDto.response.*;
import com.service.main.repository.UserRepository;
import com.service.main.service.ImageUploadingService;
import com.service.main.service.MailService;
import com.service.main.service.OTPGenerator;
import com.service.main.service.azure.AzureSender;
import com.service.main.service.azure.models.MailPayload;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("userCM")
public class UserCMController {

    @Autowired
    private UserCMService userCMService;

    @Autowired
    private UserRepository _userRepository;

    @Autowired
    private PasswordEncoder _passwordEncoder;

    @Autowired
    private ImageUploadingService _imageUploadingService;

    @Autowired
    private MailService _mailService;

    @Autowired
    private AzureSender _azureSender;

    @Autowired
    private UserDocumentImageRepository _userDocumentImageRepository;
    @Autowired
    private PagingService _pagingService;
    @Autowired
    private BadgeRepository _badgeRepository;
    @Autowired
    private UserBadgeRepository _userBadgeRepository;

    @GetMapping("get_user_info_by_id/{id}")
    public UserInfoDto getUserInfo(@PathVariable int id) {
        return userCMService.getUserInfoById(id);
    }


    @GetMapping("get_user_personal_info/{id}")
    public ResponseEntity<CustomResult> getUserPersonalInfo(@PathVariable int id) {
        var customResult = userCMService.getUserPersonalById(id);
        return ResponseEntity.ok(customResult);
    }

    @GetMapping("search_user_chat")
    public List<UserInfoDto> searchUserChat(@RequestParam(required = false, defaultValue = "") String search, @RequestParam int userId, @RequestParam List<Long> friendsId) {
        return userCMService.searchForUser(userId, search, friendsId);
    }

    @GetMapping("search_user_group_chat")
    public ResponseEntity<CustomResult> searchUserGroupChat(@RequestParam(required = false, defaultValue = "") String search, @RequestParam int userId) {
        var customResult = userCMService.searchUserForGroupChat(userId, search);
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("legalName")
    public ResponseEntity<CustomResult> putLegalName(@ModelAttribute LegalNameRequest request) {
//        CustomResult result = new CustomResult();
//        try {
//            // Change mock after
//            String mockEmail = "bigmouth3033@gmail.com";
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//
//            User user = _userRepository.findUserByEmail(email);
//            user.setFirstName(request.getFirstName());
//            user.setLastName(request.getLastName());
//            user = _userRepository.save(user);
//
//            LegalNameResponse response = new LegalNameResponse();
//            response.setFirstName(user.getFirstName());
//            response.setLastName(user.getLastName());
//
//            result.setStatus(200);
//            result.setMessage("Update Legal Success");
//            result.setData(response);
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            result.setStatus(400);
//            result.setMessage("Something went wrong while update LegalName");
//            result.setData(null);
//            return ResponseEntity.badRequest().body(result);
//        }
        return userCMService.putLegalName(request);
    }

    @PutMapping("preferredName")
    public ResponseEntity<CustomResult> putPreferredName(@ModelAttribute PreferredNameRequest request) {
//        CustomResult result = new CustomResult();
//        try {
//            // Change mock after
//            String mockEmail = "bigmouth3033@gmail.com";
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//
//            User user = _userRepository.findUserByEmail(email);
//            user.setPreferredName(request.getPreferredName());
//            user = _userRepository.save(user);
//
//            PreferredNameResponse response = new PreferredNameResponse();
//            response.setPreferredName(user.getPreferredName());
//
//            result.setStatus(200);
//            result.setMessage("Update Preferred Success");
//            result.setData(response);
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            result.setStatus(400);
//            result.setMessage("Something went wrong while update LegalName");
//            result.setData(null);
//            return ResponseEntity.badRequest().body(result);
//        }
        return userCMService.putPreferredName(request);
    }

    @PutMapping("phoneNumber")
    public ResponseEntity<CustomResult> putPhoneNumber(@ModelAttribute PhoneNumberRequest request) {
//        CustomResult result = new CustomResult();
//        try {
//            // Change mock after
//            String mockEmail = "bigmouth3033@gmail.com";
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//
//            User user = _userRepository.findUserByEmail(email);
//            user.setPhoneNumber(request.getPhoneNumber());
//            user = _userRepository.save(user);
//
//            PhoneNumberResponse phoneNumberResponse = new PhoneNumberResponse();
//            phoneNumberResponse.setPhoneNumber(user.getPhoneNumber());
//
//            result.setStatus(200);
//            result.setMessage("Update Preferred Success");
//            result.setData(phoneNumberResponse);
//            return ResponseEntity.ok(result);
//
//        } catch (Exception e) {
//            result.setStatus(400);
//            result.setMessage("Something went wrong while update LegalName");
//            result.setData(null);
//            return ResponseEntity.badRequest().body(result);
//        }
        return userCMService.putPhoneNumber(request);
    }

    @PutMapping("address")
    public ResponseEntity<CustomResult> putAddress(@ModelAttribute AddressRequest request) {
//        CustomResult result = new CustomResult();
//        try {
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//
//            User user = _userRepository.findUserByEmail(email);
//            user.setAddress(request.getAddress());
//            _userRepository.save(user);
//
//            AddressResponse addressResponse = new AddressResponse();
//            addressResponse.setAddress(user.getAddress());
//
//            result.setStatus(200);
//            result.setMessage("Update Preferred Success");
//            result.setData(addressResponse);
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            result.setStatus(400);
//            result.setMessage("Something went wrong while update Address");
//            result.setData(null);
//            return ResponseEntity.badRequest().body(result);
//        }
        return userCMService.putAddress(request);
    }

    @PutMapping("government")
    public ResponseEntity<CustomResult> putGovernment(@ModelAttribute GovernmentRequest request) {
//        CustomResult result = new CustomResult();
//        try {
//            // Change mock after
//            String mockEmail = "bigmouth3033@gmail.com";
//
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//
//            User user = _userRepository.findUserByEmail(email);
//            var frontImageUrl = _imageUploadingService.upload(request.getFrontImage());
//            var backImageUrl = _imageUploadingService.upload(request.getBackImage());
//
//            // update DriverLicense
//            if (request.getIdType() == 1) {
//                user.setDriverLicenseFrontUrl(frontImageUrl);
//                user.setDriverLicenseBackUrl(backImageUrl);
//                user.setDriverLicenseCountry(request.getGovernmentCountry());
//            }
//            // update IdentityCard
//            if (request.getIdType() == 2) {
//                user.setIdentityCardFrontUrl(frontImageUrl);
//                user.setIdentityCardBackUrl(backImageUrl);
//                user.setIdentityCardCountry(request.getGovernmentCountry());
//            }
//            _userRepository.save(user);
//
//            GovernmentResponse governmentResponse = new GovernmentResponse();
//            governmentResponse.setIdType(request.getIdType());
//            governmentResponse.setFrontImageUrl(frontImageUrl);
//            governmentResponse.setBackImageUrl(backImageUrl);
//            governmentResponse.setGovernmentCountry(request.getGovernmentCountry());
//            result.setStatus(200);
//            result.setMessage("Update Government Success");
//            result.setData(governmentResponse);
//            return ResponseEntity.ok(result);
//
//        } catch (Exception e) {
//            result.setStatus(400);
//            result.setMessage("Some thing went wrong while update Government");
//            result.setData(null);
//            return ResponseEntity.badRequest().body(result);
//
//        }
        return userCMService.putGovernment(request);
    }

    @PutMapping("changePassword")
    public ResponseEntity<CustomResult> putChangePassword(@ModelAttribute ChangePasswordRequest request) {
        CustomResult result = new CustomResult();
        try {
            // Change mock after
            String mockEmail = "bigmouth3033@gmail.com";

            var email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = _userRepository.findUserByEmail(email);

            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                result.setStatus(404);
                result.setMessage("Password confirm doesn't match");
                result.setData(null);
                return ResponseEntity.ok(result);
            }

            if (!_passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                result.setStatus(404);
                result.setMessage("Current password doesn't match");
                result.setData(null);
                return ResponseEntity.ok(result);
            }

            if (_passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                result.setStatus(404);
                result.setMessage("New Password cannot same Current Password");
                result.setData(null);
                return ResponseEntity.ok(result);
            }

            String otp = OTPGenerator.generateOTP();
            user.setNewPassword(_passwordEncoder.encode(request.getNewPassword()));
            user.setOTP(otp);
            user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(2));
            _userRepository.save(user);

            MailPayload mailPayload = new MailPayload();
            mailPayload.setFile(null);
            mailPayload.setTo(user.getEmail());
            String[] cc = {user.getEmail()};
            mailPayload.setCc(cc);

            String otpSubject = "Your OTP for Password Change Request";
            String otpNotification = "Your One-Time Password (OTP) for changing your password is: " + otp + " Please use this OTP to proceed with your password change. " + "This OTP is valid for 10 minutes and should not be shared with anyone.";
            String emailHtml = "<html>" + "<head>" + "    <style>" + "        body {" + "            font-family: Arial, sans-serif;" + "            background-color: #f4f4f4;" + "            color: #333;" + "            padding: 20px;" + "        }" + "        .container {" + "            background: #fff;" + "            border-radius: 8px;" + "            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);" + "            padding: 20px;" + "            max-width: 400px;" + "            margin: auto;" + "        }" + "        .otp {" + "            font-size: 24px;" + "            font-weight: bold;" + "            color: #007bff;" + "            margin: 20px 0;" + "        }" + "        .note {" + "            font-size: 14px;" + "            color: #888;" + "        }" + "    </style>" + "</head>" + "<body>" + "    <div class=\"container\">" + "        <h2>Your OTP for Password Change</h2>" + "        <p class=\"otp\">" + otp + "</p>" // Replace with actual OTP
                    + "        <p class=\"note\">This OTP is valid for 10 minutes and should not be shared with anyone.</p>" + "    </div>" + "</body>" + "</html>";
            mailPayload.setSubject(otpSubject);
            mailPayload.setBody(emailHtml);
            _azureSender.sendMessage(mailPayload);

            result.setStatus(200);
            result.setData(null);
            String message = String.format("Your OTP has been sent to your email %s", otp);
            result.setMessage(message);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.setStatus(400);
            result.setMessage("Some thing went wrong while update password");
            result.setData(null);
            return ResponseEntity.ok(result);
        }
    }

    @PutMapping("checkOTP")
    public ResponseEntity<CustomResult> putCheckOtp(@ModelAttribute OtpConfirmRequest request) {
//        CustomResult result = new CustomResult();
//        try {
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//            User user = _userRepository.findUserByEmail(email);
//
//            if (user.getOTP().equals(request.getOtp())) {
//                if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
//                    result.setStatus(404);
//                    result.setMessage("Otp expired");
//                    result.setData(null);
//                    return ResponseEntity.ok(result);
//                }
//
//                String newPassword = user.getNewPassword();
//                user.setPassword(newPassword);
//                _userRepository.save(user);
//
//                result.setStatus(200);
//                result.setMessage("Update Password Success");
//                result.setData(null);
//                return ResponseEntity.ok(result);
//            } else {
//                result.setStatus(404);
//                result.setMessage("Otp doesn't exist");
//                result.setData(null);
//                return ResponseEntity.ok(result);
//            }
//        } catch (Exception e) {
//            result.setStatus(400);
//            result.setMessage("Some thing went wrong while check Otp");
//            result.setData(null);
//            return ResponseEntity.badRequest().body(result);
//        }
        return userCMService.putCheckOtp(request);
    }

    @PutMapping("updateAvatar")
    public ResponseEntity<CustomResult> putAvatar(@ModelAttribute AvatarOptionRequest request) {
//        CustomResult result = new CustomResult();
//        try {
//            // Change mock later
//            String mockEmail = "bigmouth3033@gmail.com";
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//
//            User user = _userRepository.findUserByEmail(email);
//            String avatarUrl = _imageUploadingService.upload(request.getAvatarFileImage());
//            if (request.getAvatarOption().equals("1")) {
//                user.setAvatar(avatarUrl);
//                _userRepository.save(user);
//                result.setStatus(200);
//                result.setMessage("Update Avatar Success");
//                result.setData(null);
//                return ResponseEntity.ok(result);
//            }
//            if (request.getAvatarOption().equals("2")) {
//                user.setRealAvatar(avatarUrl);
//                _userRepository.save(user);
//                result.setStatus(200);
//                result.setMessage("Update Personal Avatar Success");
//                result.setData(null);
//                return ResponseEntity.ok(result);
//            }
//
//            result.setStatus(204);
//            result.setMessage("No Operation");
//            result.setData(null);
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            result.setStatus(400);
//            result.setMessage("Some thing went wrong while update Avatar");
//            result.setData(null);
//            return ResponseEntity.badRequest().body(result);
//        }
        return userCMService.putAvatar(request);
    }

    @GetMapping("userRefill")
    public ResponseEntity<CustomResult> getUserRefill() {
//        CustomResult result = new CustomResult();
//        try {
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//            User user = _userRepository.findUserByEmail(email);
//            UserRefillResponse response = new UserRefillResponse();
//
//
//            if (user.getAddress() != null && !user.getAddress().isEmpty()) {
//                response.getMessage().add("Address");
//                response.setProgress(response.getProgress() + 1);
//
//            }
//            if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
//                response.getMessage().add("Phone Number");
//                response.setProgress(response.getProgress() + 1);
//            }
//            if (user.getRealAvatar() != null && !user.getRealAvatar().isEmpty()) {
//                response.getMessage().add("Real Avatar");
//                response.setProgress(response.getProgress() + 1);
//            }
//            if (user.getIdentityCardFrontUrl() != null && !user.getIdentityCardFrontUrl().isEmpty() && user.getIdentityCardBackUrl() != null && !user.getIdentityCardBackUrl().isEmpty()) {
//                response.getMessage().add("Identity");
//                response.setProgress(response.getProgress() + 1);
//            }
//            if (user.getDriverLicenseFrontUrl() != null && !user.getDriverLicenseFrontUrl().isEmpty() && user.getDriverLicenseBackUrl() != null && !user.getDriverLicenseBackUrl().isEmpty()) {
//                response.getMessage().add("Driver License");
//                response.setProgress(response.getProgress() + 1);
//            }
//            response.setComplete(response.getProgress() == 5);
//
//            result.setStatus(200);
//            result.setData(response);
//            result.setMessage("");
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            result.setStatus(400);
//            result.setData(null);
//            result.setMessage("Some thing wrong when get user refill");
//            return ResponseEntity.ok(result);
//        }
        return userCMService.getUserRefill();
    }

    @GetMapping("userRefill/{userId}")
    public ResponseEntity<CustomResult> getUserRefillById(@PathVariable int userId) {
        CustomResult result = new CustomResult();
        try {
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//            User user = _userRepository.findUserByEmail(email);
            var user = _userRepository.findUserById(userId);
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

    @PostMapping("userRefill")
    public ResponseEntity<CustomResult> postUserRefill() {
//        CustomResult result = new CustomResult();
//        try {
//            var email = SecurityContextHolder.getContext().getAuthentication().getName();
//            User user = _userRepository.findUserByEmail(email);
//            UserDocumentImage userDocumentImage = _userDocumentImageRepository.findByUser(user);
//
//            if (userDocumentImage == null) {
//                userDocumentImage = new UserDocumentImage();
//                userDocumentImage.setCreateDate(LocalDateTime.now());
//                userDocumentImage.setUpdateDate(LocalDateTime.now());
//            }
//
//
//            userDocumentImage.setUser(user);
//            userDocumentImage.setAddress(user.getAddress());
//            userDocumentImage.setPhoneNumber(user.getPhoneNumber());
//            userDocumentImage.setRealAvatar(user.getRealAvatar());
//            userDocumentImage.setIdentityCardFrontUrl(user.getIdentityCardFrontUrl());
//            userDocumentImage.setIdentityCardBackUrl(user.getIdentityCardBackUrl());
//            userDocumentImage.setDriverLicenseFrontUrl(user.getDriverLicenseFrontUrl());
//            userDocumentImage.setDriverLicenseBackUrl(user.getDriverLicenseBackUrl());
//            userDocumentImage.setStatus("PENDING");
//            userDocumentImage.setUpdateDate(LocalDateTime.now());
//            _userDocumentImageRepository.save(userDocumentImage);
//            result.setStatus(200);
//            result.setMessage("Your upgrade request has been sent");
//            result.setData(null);
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            result.setStatus(404);
//            result.setMessage("Something went wrong when send you upgrade request");
//            result.setData(null);
//            return ResponseEntity.ok(result);
//        }
        return userCMService.postUserRefill();
    }

    @GetMapping("userDocuments")
    public ResponseEntity<CustomPaging> getUserDocuments(@RequestParam int pageNumber,
                                                         @RequestParam int pageSize,
                                                         @RequestParam(required = false) int statusId,
                                                         @RequestParam(required = false) String toDateTime,
                                                         @RequestParam(required = false) String fromDateTime) {
        try {
            String status = switch (statusId) {
                case 1 -> "";
                case 2 -> "ACCEPTED";
                case 3 -> "PENDING";
                case 4 -> "DENY";
                default -> "";
            };

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss z");

            LocalDateTime fromLocalDateTime = LocalDateTime.parse(fromDateTime, formatter);
            LocalDateTime toLocalDateTime = LocalDateTime.parse(toDateTime, formatter);
            LocalDateTime fromLocalDateTimePlus7 = fromLocalDateTime.plusHours(7);
            LocalDateTime toLocalDateTimePlus7 = toLocalDateTime.plusHours(7);

            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createDate"));
            var udis = _userDocumentImageRepository.findUserDocumentImageBy(status, fromLocalDateTimePlus7, toLocalDateTimePlus7, pageable);

            var customPaging = _pagingService.convertToCustomPaging(udis, pageNumber, pageSize);

            List<UserDocumentDto> listUserDto = new ArrayList<>();

            for(var document : (List<UserDocumentImage>) customPaging.getData()){
                UserDocumentDto dto = new UserDocumentDto();
                BeanUtils.copyProperties(document, dto);
                UserAuthDto user = new UserAuthDto();
                BeanUtils.copyProperties(document.getUser(), user);

                dto.setUser(user);
                listUserDto.add(dto);
            }
            customPaging.setData(listUserDto);

            return ResponseEntity.ok(customPaging);

        } catch (Exception e) {
            var cg = new CustomPaging();
            cg.setStatus(404);
            cg.setMessage("Something went wrong when get user documents");
            cg.setMessage(e.getMessage());
            return ResponseEntity.ok(cg);
        }
    }

    @PostMapping("userDocuments")
    public ResponseEntity<CustomResult> postUserDocuments(@ModelAttribute UserDocumentRequest request) {
        CustomResult result = new CustomResult();
        try {
            UserDocumentImage userDocumentImage = _userDocumentImageRepository.findById(request.getId()).orElseThrow();
            if (request.getStatusId() == 1) {
                var badgeCheck  = _userBadgeRepository.findUserBadgeByUserId(userDocumentImage.getUser().getId());

                if(badgeCheck != null){
                    userDocumentImage.setStatus("ACCEPTED");
                    _userDocumentImageRepository.save(userDocumentImage);
                    return ResponseEntity.ok(new CustomResult(403, "Badge exist!", null));
                }

                userDocumentImage.setStatus("ACCEPTED");
                UserBadge userBadge = new UserBadge();
                Badge badge = _badgeRepository.findById(4).orElseThrow();

                UserBadgeId userBadgeId = new UserBadgeId();
                userBadgeId.setUserId(userDocumentImage.getUser().getId());
                userBadgeId.setBadgeId(badge.getId());

                userBadge.setUserBadgeId(userBadgeId);

                userBadge.setBadge(badge);
                userBadge.setUser(userDocumentImage.getUser());

                _userBadgeRepository.save(userBadge);

                result.setStatus(200);
                result.setMessage("Update User Government success");
                result.setData(null);
                return ResponseEntity.ok(result);
            }
            if (request.getStatusId() == 2) {

                userDocumentImage.setStatus("DENY");
                _userDocumentImageRepository.save(userDocumentImage);
                result.setStatus(200);
                result.setMessage("Update User Government success");
                result.setData(null);
                return ResponseEntity.ok(result);
            }
            result.setStatus(204);
            result.setMessage("Nothing change");
            result.setData(null);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
