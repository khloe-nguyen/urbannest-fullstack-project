package com.service.main.repository;

import com.service.main.entity.Notification;
import com.service.main.entity.NotificationAdmin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationAdminRepository extends JpaRepository<NotificationAdmin, Integer> {


    @Query(value = "select n " +
            "from NotificationAdmin n " +
            "where n.admin.id = :id " +
            "and (n.isRead = :status or :status is null) ")
    Page<NotificationAdmin> findByUserId(@Param("id") Integer id, @Param("status") Boolean status, Pageable pageable);
}
