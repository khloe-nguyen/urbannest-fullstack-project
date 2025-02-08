package com.service.main.repository;

import com.service.main.entity.Admin;
import com.service.main.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    @Query(value = "select n from Notification n where n.user.id = :userId and n.isRead is false order by n.id desc limit 20")
    List<Notification> findUserPopUpNotification(@Param("userId") Integer userId);


    @Query(value = "select n " +
            "from Notification n " +
            "where n.user.id = :id " +
            "and (n.isRead = :status or :status is null) ")
    Page<Notification> findByUserId(@Param("id") Integer id, @Param("status") Boolean status, Pageable pageable);
}
