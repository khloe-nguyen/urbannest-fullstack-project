package com.service.main.dto;

import com.service.main.entity.Property;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.N;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyHomePageFilter {
    Property property;
    Double totalRecord;
}
