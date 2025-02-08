package com.service.main.service.admin;

import com.service.main.dto.CustomResult;
import com.service.main.dto.RefundDto;
import com.service.main.repository.RefundPolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefundADService {

    @Autowired
    private RefundPolicyRepository refundPolicyRepository;


    public CustomResult getAllRefundPolicy(){
        try{

            List<RefundDto> policies = refundPolicyRepository.findAll().stream().map(refundPolicy -> {
                var refundDto = new RefundDto();
                refundDto.setId(refundPolicy.getId());
                refundDto.setPolicyName(refundPolicy.getPolicyName());
                refundDto.setPolicyDescription(refundPolicy.getPolicyDescription());
                return refundDto;
            }).toList();

            return new CustomResult(200, "Success", policies);
        }catch (Exception e){
            return new CustomResult(400, e.getMessage(), null);
        }
    }
}
