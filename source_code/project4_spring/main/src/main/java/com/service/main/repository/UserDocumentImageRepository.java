package com.service.main.repository;

import com.service.main.entity.Booking;
import com.service.main.entity.User;
import com.service.main.entity.UserDocumentImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Repository
public interface UserDocumentImageRepository extends JpaRepository<UserDocumentImage, Integer> {
    UserDocumentImage findByUser(User user);

    @Query(value = "select udi from UserDocumentImage udi where (:status is null or udi.status like %:status% " +
            "AND (:fromDate IS NULL OR udi.createDate >= :fromDate) " +
            "AND (:toDate IS NULL OR udi.createDate <= :toDate) " +
            ")")
    Page<UserDocumentImage> findUserDocumentImageBy(@Param("status") String status,
                                                    @Param("fromDate") LocalDateTime fromDate,
                                                    @Param("toDate") LocalDateTime toDate,
                                                    Pageable pageable);
}
