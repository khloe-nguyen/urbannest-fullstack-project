package com.service.main.controller;

import com.google.gson.Gson;
import com.service.main.dto.*;
import com.service.main.repository.PropertyRepository;
import com.service.main.service.customer.ListingCMService;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("listingCM")
public class ListingCMController {

    @Autowired
    private ListingCMService listingCMService;

    @Autowired
    private PropertyRepository propertyRepository;

    @PostMapping("initial")
    public ResponseEntity<CustomResult> initializeListing(){
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customResult = listingCMService.initializeListing(email);
        return ResponseEntity.ok(customResult);
    }

    @GetMapping("get_host_listing_by_id")
    public ResponseEntity<CustomResult> getListingByID(@RequestParam Integer id){
        var email = SecurityContextHolder.getContext().getAuthentication().getName();

        var customResult = listingCMService.getListing(email, id);

        return ResponseEntity.ok(customResult);
    }

    @PostMapping("update_listing")
    public ResponseEntity<CustomResult> updateListing(@ModelAttribute PropertyDto property){
        var customResult = listingCMService.updateListing(property);
        return ResponseEntity.ok(customResult);
    }

    @GetMapping("get_host_listings")
    public ResponseEntity<CustomPaging> getListings(@RequestParam int pageNumber, @RequestParam int pageSize, @RequestParam(required = false, defaultValue = "") String search, @RequestParam String status){
        var email = SecurityContextHolder.getContext().getAuthentication().getName();
        var customPaging = listingCMService.getHostListing(pageNumber, pageSize, email, search, status);
        return ResponseEntity.ok(customPaging);
    }

    @GetMapping("get_host_calendar_list")
    public ResponseEntity<CustomResult> getHostCalendarList(){
        var email = SecurityContextHolder.getContext().getAuthentication().getName();

        var customResult = listingCMService.getAllListingOfHost(email);
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("update_exception_date")
    public ResponseEntity<CustomResult> updateExceptionDate(@ModelAttribute UpdateExceptionDateDto updateExceptionDateDto){
        var customResult = listingCMService.changePriceForDates(updateExceptionDateDto.getPropertyId(), updateExceptionDateDto.getStart(), updateExceptionDateDto.getEnd(), updateExceptionDateDto.getPrice());
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("update_exception_date_mobile")
    public ResponseEntity<CustomResult> updateExceptionDateMobile(@ModelAttribute UpdateExceptionDateDto updateExceptionDateDto){
        var customResult = listingCMService.changePriceForDatesMobile(updateExceptionDateDto.getPropertyId(), updateExceptionDateDto.getDates(), updateExceptionDateDto.getPrice());
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("update_not_available_date")
    public ResponseEntity<CustomResult> updateNotAvailableDate(@ModelAttribute UpdateExceptionDateDto updateExceptionDateDto){
        var customResult = listingCMService.blockDate(updateExceptionDateDto.getPropertyId(), updateExceptionDateDto.getStart(), updateExceptionDateDto.getEnd());
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("update_not_available_date_mobile")
    public ResponseEntity<CustomResult> updateNotAvailableDateMobile(@ModelAttribute UpdateExceptionDateDto updateExceptionDateDto){
        var customResult = listingCMService.blockDateMobile(updateExceptionDateDto.getPropertyId(), updateExceptionDateDto.getDates());
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("open_not_available_date_mobile")
    public ResponseEntity<CustomResult> openNotAvailableDateMobile(@ModelAttribute UpdateExceptionDateDto updateExceptionDateDto){
        var customResult = listingCMService.openDateMobile(updateExceptionDateDto.getPropertyId(), updateExceptionDateDto.getDates());
        return ResponseEntity.ok(customResult);
    }


    @PutMapping("open_not_available_date")
    public ResponseEntity<CustomResult> openNotAvailableDate(@ModelAttribute UpdateExceptionDateDto updateExceptionDateDto){
        var customResult = listingCMService.openDate(updateExceptionDateDto.getPropertyId(), updateExceptionDateDto.getStart(), updateExceptionDateDto.getEnd());
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("public_request")
    public ResponseEntity<CustomResult> publicRequest(int propertyID){
        var customResult = listingCMService.pendingRequest(propertyID);
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("change_base_price")
    public ResponseEntity<CustomResult> changeBasePrice(@ModelAttribute ChangePropertyPriceDto changePropertyPriceDto){
        var customResult = listingCMService.changeBasePriceOfProperty(changePropertyPriceDto);
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("change_monthly_discount")
    public ResponseEntity<CustomResult> changeMonthlyDiscount(@ModelAttribute ChangePropertyPriceDto changePropertyPriceDto){
        var customResult = listingCMService.changeMonthlyOfProperty(changePropertyPriceDto);
        return ResponseEntity.ok(customResult);
    }

    @PutMapping("change_weekly_discount")
    public ResponseEntity<CustomResult> changeWeeklyDiscount(@ModelAttribute ChangePropertyPriceDto changePropertyPriceDto){
        var customResult = listingCMService.changeWeeklyOfProperty(changePropertyPriceDto);
        return ResponseEntity.ok(customResult);
    }

    @GetMapping
    public ResponseEntity<CustomResult> getProperty(@RequestParam int id) {
        CustomResult result = listingCMService.getListingById(id);
        return ResponseEntity.ok(result);
    }


    @GetMapping("propertyCM")
    public ResponseEntity<CustomPaging> getAllProperties(
            @RequestParam int pageNumber,
            @RequestParam int pageSize,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String isInstant,
            @RequestParam(required = false) Boolean isSelfCheckIn,
            @RequestParam(required = false) Boolean isPetAllowed,
            @RequestParam(required = false) List<Integer> amenities,
            @RequestParam(required = false) List<Double> priceRange,
            @RequestParam(required = false) Integer room,
            @RequestParam(required = false) Integer bed,
            @RequestParam(required = false) Integer bathRoom,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer guest,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ward,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        var customResult = listingCMService.getAllProperties(pageNumber, pageSize, categoryId, name, propertyType, amenities, isInstant, isSelfCheckIn, isPetAllowed, priceRange, room, bed, bathRoom, guest, province, district, ward, startDate, endDate);
        return ResponseEntity.ok(customResult);
    }


    @GetMapping("propertyCMflutter")
    public ResponseEntity<CustomPaging> getAllPropertiesFlutter(
            @RequestParam int pageNumber,
            @RequestParam int pageSize,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String isInstant,
            @RequestParam(required = false) Boolean isSelfCheckIn,
            @RequestParam(required = false) Boolean isPetAllowed,
            @RequestParam(required = false) String amenities,
            @RequestParam(required = false) String priceRange,
            @RequestParam(required = false) Integer room,
            @RequestParam(required = false) Integer bed,
            @RequestParam(required = false) Integer bathRoom,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer guest,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ward,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        Gson gson = new Gson();
        // Giải mã URL
        String decodedAmenities = (amenities != null) ? URLDecoder.decode(amenities, StandardCharsets.UTF_8) : "[]";
        String decodedPriceRange = (priceRange != null) ? URLDecoder.decode(priceRange, StandardCharsets.UTF_8) : "[]";

        // Chuyển đổi từ chuỗi JSON thành List
        List<Integer> amenitiesList = gson.fromJson(decodedAmenities, List.class);
        List<Double> priceRangeList = gson.fromJson(decodedPriceRange, List.class);

        // Kiểm tra và gán null nếu danh sách trống
        if (amenitiesList.isEmpty()) {
            amenitiesList = null;
        }
        if (priceRangeList.isEmpty()) {
            priceRangeList = null;
        }
        var customResult = listingCMService.getAllProperties(pageNumber, pageSize, categoryId, name, propertyType, amenitiesList, isInstant, isSelfCheckIn, isPetAllowed, priceRangeList, room, bed, bathRoom, guest, province, district, ward, startDate, endDate);
        return ResponseEntity.ok(customResult);
    }


    @GetMapping("my test/{id}")
    public ResponseEntity<?> test(@PathVariable int id){

      var result = propertyRepository.test(id);
        return ResponseEntity.ok(result);
    }

}
