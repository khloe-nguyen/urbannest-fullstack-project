package com.service.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    private Integer id;

    private String categoryName;

    private String description;

    private String categoryImage;

    private boolean status;

    private Integer propertyCount;
}
