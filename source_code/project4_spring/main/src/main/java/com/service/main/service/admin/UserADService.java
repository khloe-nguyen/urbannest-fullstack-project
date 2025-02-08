package com.service.main.service.admin;

import com.service.main.dto.*;
import com.service.main.repository.UserRepository;
import com.service.main.service.PagingService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserADService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PagingService pagingService;


    public CustomPaging getUserList(int pageNumber, int pageSize, String searchText, List<Integer> badges, String userType) {
        try{
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("updatedAt").descending());

            var users = userRepository.getUserByAdmin(searchText, badges, userType, pageable);

            var list = users.getContent().stream().map(user -> {
                var userAuthDto = new UserAuthDto();
                BeanUtils.copyProperties(user, userAuthDto);

                List<BadgeDto> userBadges = new ArrayList<>();

                for(var badge : user.getUserBadges()){
                    var newBadgeDto = new BadgeDto();
                    newBadgeDto.setId(badge.getBadge().getId());
                    newBadgeDto.setName(badge.getBadge().getName());
                    newBadgeDto.setDescription(badge.getBadge().getDescription());
                    userBadges.add(newBadgeDto);
                }

                userAuthDto.setBadgeList(userBadges);
                userAuthDto.setHost(!user.getProperties().isEmpty());

                return userAuthDto;

            }).collect(Collectors.toList());

            Page<UserAuthDto> updatedPage = new PageImpl<>(list, pageable, users.getTotalElements());

            return pagingService.convertToCustomPaging(updatedPage, pageNumber,pageSize);
        }catch (Exception ex){
            var customPaging = new CustomPaging();
            customPaging.setStatus(400);
            customPaging.setMessage(ex.getMessage());
            return customPaging;
        }
    }
}
