package com.service.main.repository;


import com.service.main.entity.FCMToken;
import feign.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface FCMTokenRepository extends CrudRepository<FCMToken, Integer> {

    FCMToken findFCMTokensByFCMTokenAndUserId(String fcmToken, int userId);

    @Query(value = "select p from FCMToken p where p.userId = :userId ")
    List<FCMToken> findAllByUserId(@Param("userId") int userId);
}
