package com.service.main.repository;

import com.service.main.dto.BookingCountDto;
import com.service.main.dto.ReservedCountDto;
import com.service.main.dto.TripCountDto;
import com.service.main.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {


    @Query(value = "select p from Booking p where p.host.id = :id and :date >= p.checkInDay and :date <= p.checkOutDay and p.status = 'ACCEPT'")
    Page<Booking> getCurrentlyHostingBook(@Param("id") Integer id, @Param("date") Date date,Pageable pageable);

    @Query(value = "select p from Booking p where p.host.id = :id and function('DATE', p.checkOutDay) = function('DATE', :date) and p.status = 'ACCEPT'")
    Page<Booking> getCheckoutHostingBook(@Param("id") Integer id, @Param("date") Date date,Pageable pageable);

    @Query(value = "select p from Booking p where p.host.id = :id and function('DATE', p.checkInDay) = function('DATE', :date) and p.status = 'ACCEPT' ")
    Page<Booking> getCheckInHostingBook(@Param("id") Integer id, @Param("date") Date date,Pageable pageable);

    @Query(value = "select p from Booking p where p.host.id = :id and :date < p.checkInDay and p.status = 'ACCEPT' ")
    Page<Booking> getUpcomingHostingBook(@Param("id") Integer id, @Param("date") Date date,Pageable pageable);

    @Query(value = "select p " +
            "from Booking p " +
            "where p.host.id = :id " +
            "and :date > p.checkOutDay" +
            " and :date < p.checkOutDay + 7 day " +
            "and p.hostReview is null " +
            "and p.status = 'ACCEPT' "
            )
    Page<Booking> getPendingReviewHostingBook(@Param("id") Integer id, @Param("date") Date date, Pageable pageable);


    @Query("select new com.service.main.dto.BookingCountDto(" +
            "(select count(p) from Booking p where p.host.id = :id and :date >= p.checkInDay and :date <= p.checkOutDay and p.status = 'ACCEPT'), " +
            "(select count(p) from Booking p where p.host.id = :id and function('DATE', p.checkOutDay) = function('DATE', :date) and p.status = 'ACCEPT'), " +
            "(select count(p) from Booking p where p.host.id = :id and function('DATE', p.checkInDay) = function('DATE', :date) and p.status = 'ACCEPT'), " +
            "(select count(p) from Booking p where p.host.id = :id and :date < p.checkInDay and p.status = 'ACCEPT'), " +
            "(select count(p) from Booking p where p.host.id = :id and :date > p.checkOutDay and :date < p.checkOutDay + 7 day and p.hostReview is null and p.status = 'ACCEPT'), " +
            "(select count(p) from Booking p where p.host.id = :id and p.bookingType = 'reserved'))" +
            "from Booking p " +
            "where p.host.id = :id " +
            "group by p.host.id")
    BookingCountDto getBookingCounts(@Param("id") Integer id, @Param("date") Date date);

    @Query(value = "select b from Booking b where b.property.id = :propertyId and b.status = 'ACCEPT' ")
    List<Booking> findAllByPropertyId(@Param("propertyId") int propertyId);


    @Query(value = "select p " +
            "from Booking p " +
            "where p.property.id = :propertyId " +
            "and p.status = 'ACCEPT' and " +
            "((function('date',:start) >= function('date', p.checkInDay) and function('date',:start) < function('date', p.checkOutDay)) or " +
            "(function('date',:end) > function('date', p.checkInDay) and function('date',:end) < function('date', p.checkOutDay)) or " +
            "(function('date', p.checkInDay) >= function('date',:start) and function('date', p.checkOutDay) < function('date',:end)))")
    List<Booking> checkIfBlockable(@Param("propertyId") int propertyId,
                                   @Param("start") Date start,
                                   @Param("end") Date end);

    @Query(value = "select distinct p " +
            "from Booking p " +
            "left join p.bookDateDetails pd " +
            "where p.property.id = :propertyId " +
            "and p.status = 'ACCEPT' " +
            "and pd.night in :listBlockDates")
    List<Booking> checkIfBlockableByDateDetail(@Param("propertyId")int propertyId,  @Param("listBlockDates") List<Date> listBlockDates);

    @Query(value = "select p " +
            "from Booking p " +
            "where p.host.id = :hostId " +
            "and p.bookingType = 'reserved' " +
            "and (p.status = :status or :status = 'All') " +
            "and (p.property.id = :propertyId or :propertyId is null)  " +
            "and (:start is null or :end is null or " +
            "((function('date',:start) >= function('date', p.checkInDay) " +
            "and function('date',:start) < function('date', p.checkOutDay)) or " +
            "(function('date',:end) > function('date', p.checkInDay) " +
            "and function('date',:end) < function('date', p.checkOutDay)) or " +
            "(function('date', p.checkInDay) >= function('date',:start) " +
            "and function('date', p.checkOutDay) < function('date',:end))))")
    Page<Booking> findReservedBooking(@Param("hostId") Integer hostId,
                                      @Param("start") Date start,
                                      @Param("end") Date end,
                                      @Param("propertyId") Integer propertyId,
                                      @Param("status") String status,
                                      Pageable pageable);


    @Query(value = "select b from Booking b where b.property.id = :propertyId and b.id != :bookingId and b.bookingType ='reserved' and b.status = 'PENDING' and " +
            "((function('date',:checkInDay) >= function('date', b.checkInDay) and function('date',:checkInDay) < function('date', b.checkOutDay)) or " +
            "(function('date',:checkOutDay) > function('date', b.checkInDay) and function('date',:checkOutDay) < function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:checkInDay) and function('date', b.checkOutDay) < function('date',:checkOutDay) ))")
    List<Booking> checkBookingConflict(@Param("bookingId") int bookingId, @Param("propertyId") Integer propertyId, @Param("checkInDay") Date checkInDay, @Param("checkOutDay") Date checkOutDay);

    @Query(value = "select b " +
            "from Booking b " +
            "where (:isAdmin = true or b.property.managedCity.id in :employeeManagedCity) " +
            "and (b.property.managedCity.id in :locationIds or :locationIds is null) " +
            "and (:propertyNameSearch is null or b.property.propertyTitle  like %:propertyNameSearch%) " +
            "and (:propertyIdSearch is null or b.property.id = :propertyIdSearch) " +
            "and (b.status = :status or :status = 'All') and " +
            "(b.customer.email like %:customerSearch% or CONCAT(b.customer.firstName, ' ', b.customer.lastName) like %:customerSearch% or :customerSearch is null) " +
            "and (b.host.email like %:hostSearch% or CONCAT(b.host.firstName, ' ', b.host.lastName) like %:hostSearch% or :hostSearch is null) " +
            "and (b.property.refundPolicy.id in :refundIds or :refundIds is null) " +
            "and (b.bookingType = :bookingType or :bookingType = 'All' ) and " +
            "((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) <= function('date', b.checkOutDay)) or " +
            "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) <= function('date',:endDate) ))")
    Page<Booking> getAdminBookingList(@Param("isAdmin")boolean isAdmin,
                                      @Param("employeeManagedCity") List<Integer> employeeManagedCity,
                                      @Param("status") String status,
                                      @Param("hostSearch") String hostSearch,
                                      @Param("customerSearch") String customerSearch,
                                      @Param("bookingType") String bookingType,
                                      @Param("startDate") Date startDate,
                                      @Param("endDate") Date endDate,
                                      @Param("locationIds") List<Integer> locationIds,
                                      @Param("propertyNameSearch") String propertyNameSearch,
                                      @Param("propertyIdSearch") Integer propertyIdSearch,
                                      @Param("refundIds") List<Integer> refundIds,
                                      Pageable pageable);


    @Query("select b from Booking b where b.status = :status")
    List<Booking> findBookingByStatus(@Param("status") String status);


    @Query("select b from Booking b where b.status = 'PENDING' and function('datediff', b.checkInDay, :now) <= 2")
    List<Booking> getExpiredReservationBooking(@Param("now")Date now);

    @Query("select b " +
            "from Booking b " +
            "where b.status = 'ACCEPT' " +
            "and function('datediff', :now, b.checkOutDay) >= 1 " +
            "and size(b.transactions) = 1")
    List<Booking> getReadyToFinishPayment(@Param("now") Date now);


    @Query("select distinct b " +
            "from Booking b " +
            "where b.customer.id = :id " +
            "and function('DATE', b.checkOutDay) = function('DATE', :date) " +
            "and b.status = 'ACCEPT' " +
            "and ((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) <= function('date', b.checkOutDay)) or " +
            "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) <= function('date',:endDate) ))" )
    Page<Booking> findUserCheckOutTrip(@Param("id") Integer id,
                                       @Param("date") Date date,
                                       @Param("startDate") Date startDate,
                                       @Param("endDate") Date endDate,
                                       Pageable pageable
                                       );

    @Query("select b " +
            "from Booking b " +
            "where b.customer.id = :id " +
            "and :date >= b.checkInDay " +
            "and :date <= b.checkOutDay " +
            "and b.status = 'ACCEPT' " +
            "and ((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) <= function('date', b.checkOutDay)) or " +
            "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) <= function('date',:endDate) ))" )

    Page<Booking> findUserCurrentlyStayInTrip(@Param("id") Integer id,
                                              @Param("date") Date date,
                                              @Param("startDate") Date startDate,
                                              @Param("endDate") Date endDate,
                                              Pageable pageable
                                              );


    @Query("select b " +
            "from Booking b " +
            "where b.customer.id = :id " +
            "and :date < b.checkInDay " +
            "and b.status = 'ACCEPT' " +
            "and ((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) <= function('date', b.checkOutDay)) or " +
            "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) < function('date',:endDate) ))" )

    Page<Booking> findUserUpcomingTrip(@Param("id") Integer id,
                                              @Param("date") Date date,
                                              @Param("startDate") Date startDate,
                                              @Param("endDate") Date endDate,
                                                Pageable pageable
                                                );

    @Query("select distinct b " +
            "from Booking b " +
            "where b.customer.id = :id " +
            "and b.status = 'ACCEPT' " +
            "and b.checkOutDay < :expiredDate " +
            "and :date > b.checkOutDay " +
            "and b.userReview is null " +
            "and " +
                "((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) < function('date', b.checkOutDay)) or " +
                "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
                " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) <= function('date',:endDate) )) and :date < b.checkOutDay + 7 day " )
    Page<Booking> findUserPendingReviewTrip(@Param("id") Integer id,
                                           @Param("date") Date date,
                                           @Param("startDate") Date startDate,
                                           @Param("endDate") Date endDate,
                                            @Param("expiredDate") Date expiredDate,
                                            Pageable pageable
                                       );


    @Query("select b " +
            "from Booking b " +
            "where b.customer.id = :id " +
            "and :date > b.checkOutDay " +
            "and b.status = 'ACCEPT' " +
            "and ((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) <= function('date', b.checkOutDay)) or " +
            "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) <= function('date',:endDate) ))")
    Page<Booking> findUserHistoryTrip(@Param("id") Integer id,
                                            @Param("date") Date date,
                                            @Param("startDate") Date startDate,
                                            @Param("endDate") Date endDate,
                                            Pageable pageable
                                            );


//    @Query("select new com.service.main.dto.TripCountDto(" +
//            "(select count(distinct p) " +
//            "from Booking p " +
//            "where p.status = 'ACCEPT' " +
//            "and p.customer.id = :id  " +
//            "and function('DATE', p.checkOutDay) = function('DATE', :date) " +
//            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) ), " +
//
//            "(select count(distinct p) " +
//            "from Booking p " +
//            "where p.status = 'ACCEPT' " +
//            "and p.customer.id = :id  " +
//            "and :date >= p.checkInDay and :date <= p.checkOutDay " +
//            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) ), " +
//
//            "(select count(distinct p) " +
//            "from Booking p " +
//            "where p.status = 'ACCEPT' " +
//            "and p.customer.id = :id  " +
//            "and :date < p.checkInDay " +
//            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) ), " +
//
//            "(select count(distinct p) " +
//            "from Booking p " +
//            "where p.status = 'ACCEPT' " +
//            "and p.customer.id = :id  " +
//            "and b.checkOutDay < :expiredDate " +
//            "and :date > p.checkOutDay " +
//            "and p.userReview is null " +
//            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) ), " +
//
//            "(select count(distinct p) from Booking p " +
//            "where p.customer.id = :id " +
//            "and p.status = 'ACCEPT' " +
//            "and :date > p.checkOutDay " +
//            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
//            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
//            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) )) " +
//            "from Booking b " +
//            "where b.customer.id = :id " +
//            "group by b.customer.id")
//    TripCountDto getTripCounts(@Param("id") Integer id,
//                               @Param("startDate") Date startDate,
//                               @Param("endDate") Date endDate,
//                               @Param("expiredDate") Date expiredDate,
//                               @Param("date") Date date
//
//        );

    @Query("select new com.service.main.dto.TripCountDto(" +
            "(select count(distinct p) " +
            "from Booking p " +
            "where p.status = 'ACCEPT' " +
            "and p.customer.id = :id  " +
            "and function('DATE', p.checkOutDay) = function('DATE', :date) " +
            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) ), " +

            "(select count(distinct p) " +
            "from Booking p " +
            "where p.status = 'ACCEPT' " +
            "and p.customer.id = :id  " +
            "and :date >= p.checkInDay and :date <= p.checkOutDay " +
            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) ), " +

            "(select count(distinct p) " +
            "from Booking p " +
            "where p.status = 'ACCEPT' " +
            "and p.customer.id = :id  " +
            "and :date < p.checkInDay " +
            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) ), " +

            "(select count(distinct p) " +
            "from Booking p " +
            "where p.status = 'ACCEPT' " +
            "and p.customer.id = :id  " +
            "and p.checkOutDay < :expiredDate " +
            "and :date > p.checkOutDay " +
            "and p.userReview is null " +
            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) ), " +

            "(select count(distinct p) " +
            "from Booking p " +
            "where p.customer.id = :id " +
            "and p.status = 'ACCEPT' " +
            "and :date > p.checkOutDay " +
            "and ((function('DATE', :startDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :startDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :endDate) >= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) <= function('DATE', p.checkOutDay)) " +
            "or (function('DATE', :startDate) <= function('DATE', p.checkInDay) " +
            "and function('DATE', :endDate) >= function('DATE', p.checkOutDay))) ))")
    TripCountDto getTripCounts(@Param("id") Integer id,
                               @Param("startDate") Date startDate,
                               @Param("endDate") Date endDate,
                               @Param("expiredDate") Date expiredDate,
                               @Param("date") Date date);




    @Query("select b " +
            "from Booking b " +
            "where b.customer.id = :id " +
            "and b.status = 'PENDING' " +
            "and ((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) <= function('date', b.checkOutDay)) or " +
            "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) <= function('date',:endDate) ))" +
            "order by b.checkInDay")
    Page<Booking> findUserPendingReserved(@Param("id") Integer id,
                                          @Param("startDate") Date startDate,
                                          @Param("endDate") Date endDate,
                                          Pageable pageable);

    @Query("select b " +
            "from Booking b " +
            "where b.customer.id = :id " +
            "and b.status = 'DENIED' " +
            "and ((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) <= function('date', b.checkOutDay)) or " +
            "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) <= function('date',:endDate) ))" +
            "order by b.checkInDay")
    Page<Booking> findUserDeniedReservedTrip(@Param("id") Integer id,
                                             @Param("startDate") Date startDate,
                                             @Param("endDate") Date endDate,
                                             Pageable pageable);

    @Query("select b " +
            "from Booking b " +
            "where b.customer.id = :id " +
            "and b.status = 'USER_CANCEL' " +
            "and ((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) <= function('date', b.checkOutDay)) or " +
            "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) <= function('date',:endDate) ))" +
            "order by b.checkInDay")
    Page<Booking> findUserCancelReservedTrip(@Param("id") Integer id,
                                             @Param("startDate") Date startDate,
                                             @Param("endDate") Date endDate,
                                             Pageable pageable);


    @Query("select new com.service.main.dto.ReservedCountDto(" +
            "(select count(p) " +
                "from Booking p where p.status = 'PENDING' and p.customer.id = :id " +
                "and ((function('date',:startDate) >= function('date', p.checkInDay) and function('date',:startDate) <= function('date', p.checkOutDay)) or (function('date',:endDate) >= function('date', p.checkInDay) and function('date',:endDate) <= function('date', p.checkOutDay)) or (function('date', p.checkInDay) >= function('date',:startDate) and function('date', p.checkOutDay) <= function('date',:endDate) ))  ), " +
            "(select count(p) " +
                "from Booking p where p.status = 'DENIED' and p.customer.id = :id  " +
                "and ((function('date',:startDate) >= function('date', p.checkInDay) and function('date',:startDate) <= function('date', p.checkOutDay)) or (function('date',:endDate) >= function('date', p.checkInDay) and function('date',:endDate) <= function('date', p.checkOutDay)) or (function('date', p.checkInDay) >= function('date',:startDate) and function('date', p.checkOutDay) <= function('date',:endDate) )) ), " +
            "(select count(p) " +
                "from Booking p where p.status = 'USER_CANCEL' and p.customer.id = :id " +
                "and ((function('date',:startDate) >= function('date', p.checkInDay) and function('date',:startDate) <= function('date', p.checkOutDay)) or (function('date',:endDate) >= function('date', p.checkInDay) and function('date',:endDate) <= function('date', p.checkOutDay)) or (function('date', p.checkInDay) >= function('date',:startDate) and function('date', p.checkOutDay) <= function('date',:endDate) )) ))"+
            "from Booking p " +
            "where p.customer.id = :id " +
            "group by p.customer.id")
    ReservedCountDto getReservedCount(@Param("id") Integer id,
                                      @Param("startDate") Date startDate,
                                      @Param("endDate") Date endDate);

    @Query("select count(b) from Booking b where b.checkInDay >= :startDate  and  b.checkInDay <= :endDate ")
    Integer findTotalBooking(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("select b from Booking b where function('date', b.checkInDay) >= function('date',:startDate ) and function('date', b.checkInDay) <= function('date',:endDate )")
    List<Booking> findBookingListBasedOnDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


    @Query(value = "select b from Booking b where b.id = :bookingId")
    Booking findBookingById(@Param("bookingId") int bookingId);



    @Query("select distinct b " +
            "from Booking b " +
            "where b.customer.id = :id " +
            "and b.status = 'REFUND' " +
            "and ((function('date',:startDate) >= function('date', b.checkInDay) and function('date',:startDate) <= function('date', b.checkOutDay)) or " +
            "(function('date',:endDate) >= function('date', b.checkInDay) and function('date',:endDate) <= function('date', b.checkOutDay)) or" +
            " (function('date', b.checkInDay) >= function('date',:startDate) and function('date', b.checkOutDay) <= function('date',:endDate) ))" +
            "order by b.checkInDay")
    Page<Booking> findUserRefundList(@Param("id") Integer id,
                                     @Param("startDate") Date startDate,
                                     @Param("endDate") Date endDate,
                                     Pageable pageable);

    @Query("select b " +
            "from Booking b " +
            "where b.host.id = :id " +
            "and b.bookingCode = :qrcode ")
    Booking findBookingByQrCode(@Param("id") Integer id,  @Param("qrcode") String qrcode);

    @Query("select b " +
            "from Booking b " +
            "where b.status = 'ACCEPT' " +
            "and function('datediff', b.checkInDay, :now) <= 2 " +
            "and b.isSelfCheckIn = true")
    List<Booking> getSelfCheckInList(@Param("now")Date now);
}
