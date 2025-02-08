package com.service.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDisputeDetailRequestDto {

    private int id;

    private String customerReason;

    private List<MultipartFile> customerImages;

    private String hostReason;

    private List<MultipartFile> hostImages;

    private String adminNote;

    private Date createdAt;

}
