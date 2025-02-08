package com.service.main.service.customer;

import com.service.main.dto.CustomResult;
import com.service.main.dto.RefundDto;
import com.service.main.repository.RefundPolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PolicyCMService {


    @Autowired
    private RefundPolicyRepository refundPolicyRepository;


    public CustomResult getServices(){
        try{
            var refunds = refundPolicyRepository.findAll();

            List<RefundDto> refundsDto = refunds.stream().map(refundPolicy -> {
                var refundDto = new RefundDto();
                refundDto.setId(refundPolicy.getId());
                refundDto.setPolicyDescription(refundPolicy.getPolicyDescription());
                refundDto.setId(refundPolicy.getId());
                refundDto.setPolicyName(refundPolicy.getPolicyName());
                return refundDto;
            }).toList();

            return new CustomResult(200, "Success", refundsDto);
        }catch (Exception ex){
            return new CustomResult(400, "Bad request", ex.getMessage());
        }
    }
}
