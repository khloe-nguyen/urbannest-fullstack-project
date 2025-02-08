package com.service.main.repository;

import com.service.main.entity.UserBadge;
import com.service.main.entity.UserBadgeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UserBadgeId> {

    @Query(value = "select p from UserBadge p where p.user.id = :userId and p.badge.id = 4")
    UserBadge findUserBadgeByUserId(@Param("userId") int userId);

}
