package com.service.main.repository;

import com.service.main.entity.Booking;
import com.service.main.entity.BookingDispute;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingDisputeRepository extends JpaRepository<BookingDispute, Integer> {



    @Query(value = "select b " +
            "from BookingDispute b " +
            "where (:isAdmin = true or b.booking.property.managedCity.id in :employeeManagedCity) " +
            "and (b.booking.property.managedCity.id in :locationIds or :locationIds is null) " +
            "and (:propertyNameSearch is null or b.booking.property.propertyTitle  like %:propertyNameSearch%) " +
            "and (:propertyIdSearch is null or b.booking.property.id = :propertyIdSearch) " +
            "and (b.status = :status or :status = 'All') and " +
            "(b.booking.customer.email like %:customerSearch% or CONCAT(b.booking.customer.firstName, ' ', b.booking.customer.lastName) like %:customerSearch% or :customerSearch is null) " +
            "and (b.booking.host.email like %:hostSearch% or CONCAT(b.booking.host.firstName, ' ', b.booking.host.lastName) like %:hostSearch% or :hostSearch is null) ")
    Page<BookingDispute> getDisputeList(@Param("isAdmin")boolean isAdmin,
                                        @Param("employeeManagedCity") List<Integer> employeeManagedCity,
                                        @Param("status") String status,
                                        @Param("hostSearch") String hostSearch,
                                        @Param("customerSearch") String customerSearch,
                                        @Param("locationIds") List<Integer> locationIds,
                                        @Param("propertyNameSearch") String propertyNameSearch,
                                        @Param("propertyIdSearch") Integer propertyIdSearch,
                                        @Param("pageable") Pageable pageable);
}
