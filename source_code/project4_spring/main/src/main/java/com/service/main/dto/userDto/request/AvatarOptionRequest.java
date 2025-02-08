package com.service.main.dto.userDto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AvatarOptionRequest {
    private MultipartFile avatarFileImage;
    private String avatarOption;
}
