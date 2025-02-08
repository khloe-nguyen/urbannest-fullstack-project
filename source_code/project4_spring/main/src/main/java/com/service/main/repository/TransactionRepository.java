package com.service.main.repository;

import com.service.main.dto.TransactionMinimizeDto;
import com.service.main.entity.Transaction;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    @Query("SELECT t FROM Transaction t WHERE t.booking.id = :bookingId")
    List<Transaction> findByBookingId(@Param("bookingId") int bookingId);



    @Query("select sum(e.amount) from Transaction e where e.transactionType = 'website_fee' and  function('date', :startDate) <= function('date', e.transferOn) and function('date', :endDate) >= function('date', e.transferOn) ")
    Double findEarning(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("select new com.service.main.dto.TransactionMinimizeDto(e.id, e.amount,e.transactionType, e.transferOn) " +
            "from Transaction e " +
            "where (e.transactionType = 'website_fee' or e.transactionType = 'refund') " +
            "and  function('date', :startDate) <= function('date', e.transferOn) " +
            "and function('date', :endDate) >= function('date', e.transferOn)")
    List<TransactionMinimizeDto> findRevenue(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
