package com.service.main.repository;

import com.service.main.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    @Query(value = "select r from Review r where r.user.id = :id")
    Page<Review> getUserOwnReview(@Param("id") Integer id, Pageable pageable);

    @Query(value = "select r from Review r where r.toUser = :id")
    Page<Review> getUserReviewedByOther(@Param("id") Integer id, Pageable pageable);


    @Query(value = "select r from Review r where r.toUser = :id")
    List<Review> getUserReviewedByOther(@Param("id") Integer id);


    @Query(value = "select r from Review r where r.toUser = :id and r.booking.property.id = :propertyId")
    Page<Review> getPropertyCustomerReview(@Param("id") Integer id, @Param("propertyId") int propertyId, Pageable pageable);

    @Query(value = "select r from Review r where r.user.id = :id and r.booking.property.id = :propertyId")
    Page<Review> getPropertyHostReview(@Param("id") Integer id, @Param("propertyId") int propertyId, Pageable pageable);

    @Query(value = "select r " +
            "from Review r " +
            "where r.toUser = :id " +
            "and r.booking.property.id = :propertyId " +
            "and r.review like %:search%")
    Page<Review> getPropertyAdminCustomerReview(@Param("id") Integer id,
                                                @Param("propertyId") int propertyId,
                                                @Param("search") String search,
                                                Pageable pageable);

    @Query("select count(r) from Review r where r.booking.property.id = :id and r.booking.property.user.id != r.user.id")
    Long countReviewsByPropertyId(@Param("id") Integer id);

    @Query( value = "select r from Review  r where  r.booking.property.id = :id and r.booking.property.user.id != r.user.id")
    Page<Review> getUserReviewedByProperty(@Param("id") Integer id, Pageable pageable);
}
