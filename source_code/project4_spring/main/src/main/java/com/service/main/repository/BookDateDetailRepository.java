package com.service.main.repository;

import com.service.main.entity.BookDateDetail;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BookDateDetailRepository extends JpaRepository<BookDateDetail, Integer> {

    @Query("SELECT p " +
            "FROM BookDateDetail p " +
            "WHERE p.property.id = :propertyId " +
            "and (p.booking.status = 'ACCEPT' or p.booking.status = 'TRANSACTIONPENDDING')")
    Optional<List<BookDateDetail>> findByPropertyId(@Param("propertyId") Integer propertyId);

    @Query("SELECT p FROM BookDateDetail p WHERE  p.booking.id =:bookingId")
    Optional<List<BookDateDetail>> findByPropertyIdAndBookingId(@Param("bookingId") Integer bookingId) ;
}
