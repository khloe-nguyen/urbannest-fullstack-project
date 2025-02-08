package com.service.main.repository;

import com.service.main.dto.PropertyHomePageFilter;
import com.service.main.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Integer> {

    Property findByIdAndUserId(Integer id, Integer userId);


    @Query(value = "select p from Property p where p.id = :id and p.status = 'PUBLIC' ")
    Property findListingById(@Param("id") int id);

    @Query(value = "select p from Property p where p.id = :id and p.status = 'PUBLIC' and p.managedCity.isManaged = true ")
    Property findAvailableListing(@Param("id") int id);

    @Query(value = "select p from Property p where p.id = :id ")
    Property findAllListingById(@Param("id") int id);

    @Query(value = "select p from Property p where p.id = :id ")
    Property findListingToChangeStatusById(@Param("id") int id);


    @Query(value = "select p from Property p where p.user.id = :userId and (p.propertyTitle like %:search% or (:search = '' and p.propertyTitle is null)) and (p.status = :status or :status = 'All')")
    Page<Property> findListingByUserId(@Param("userId") Integer userId, @Param("search") String search, @Param("status") String status,  Pageable pageable);


    List<Property> findListingByUserId(Integer userId);

    @Query(value = "select distinct p " +
            "from Property p " +
            "left join p.managedCity pc " +
            "left join p.propertyAmenities pa " +
            "where p.status != 'PROGRESS' " +
            "and (p.status = :status or :status = 'All') " +
            "and (:isAdmin = true or p.managedCity.id in :employeeManagedCity) " +
            "and (:propertyNameSearch is null or p.propertyTitle  like %:propertyNameSearch%) " +
            "and (:propertyIdSearch is null or p.id = :propertyIdSearch) " +
            "and (:searchHost is null or CONCAT(p.user.firstName, ' ', p.user.lastName) like %:searchHost% or p.user.email like %:searchHost%) " +
            "and (:bookType = 'All' or p.bookingType = :bookType) " +
            "and (:locationsIds is null or pc.id in :locationsIds) " +
            "and (:amenityIds is null or pa.amenity.id in :amenityIds ) " +
            "and (:categoryIds is null or p.propertyCategory.id in :categoryIds)")
    Page<Property> searchListingByAdmin(
            @Param("isAdmin") boolean isAdmin,
            @Param("employeeManagedCity") List<Integer> employeeManagedCity,
            @Param("status") String status,
            @Param("propertyIdSearch") Integer propertyIdSearch,
            @Param("propertyNameSearch") String propertyNameSearch,
            @Param("searchHost") String searchHost,
            @Param("bookType") String bookType,
            @Param("locationsIds") List<Integer> locationsIds,
            @Param("amenityIds") List<Integer> amenityIds,
            @Param("categoryIds") List<Integer> categoryIds,
            Pageable pageable);

    @Query(value = "SELECT distinct p " +
            "FROM Property p " +
            "JOIN p.propertyAmenities pa " +
            "left join p.bookings pb " +
            "LEFT JOIN pb.userReview ur " +
            "WHERE (:start IS NULL OR NOT EXISTS ( " +
            "    SELECT 1 FROM Booking b " +
            "    WHERE b.property.id = p.id " +
            "    AND ( (function('date',:start) >= function('date', b.checkInDay) and function('date',:start) < function('date', b.checkOutDay) or (function('date',:end) >= function('date', b.checkInDay) and function('date',:end) < function('date', b.checkOutDay)) or (function('date', b.checkInDay) >= function('date',:start) and function('date', b.checkOutDay) <= function('date',:end)  )) ) " +
            ")) " +
            "AND (p.propertyTitle LIKE %:name% OR :name IS NULL)" +
            "AND (p.propertyCategory.id = :categoryId OR :categoryId IS NULL) " +
            "AND (pa.amenity.id IN :amenities OR :amenities IS NULL) " +
            "AND (p.propertyType = :propertyType OR :propertyType IS NULL) " +
            "AND (p.bookingType = :isInstant OR :isInstant IS NULL) " +
            "AND (p.isSelfCheckIn = :isSelfCheckIn OR :isSelfCheckIn IS NULL) " +
            "AND (p.isPetAllowed = :isPetAllowed OR :isPetAllowed IS NULL) " +
            "AND (:minPrice <= p.basePrice AND p.basePrice <= :maxPrice) " +
            "AND (p.numberOfBedRoom >= :room OR :room IS NULL) " +
            "AND (p.numberOfBed >= :bed OR :bed IS NULL) " +
            "AND (p.numberOfBathRoom >= :bathRoom OR :bathRoom IS NULL)" +
            "AND (p.maximumGuest >= :guest OR :guest IS NULL) " +
            "AND (p.addressCode LIKE :addressCode% OR :addressCode IS NULL) " +
            "AND (p.status = 'PUBLIC') " +
            "AND (p.managedCity.isManaged = true) " +
            "GROUP BY p.id " +
            "ORDER BY avg(pb.userReview.totalScore) DESC , " +
            "coalesce(COUNT(pb),0) DESC",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Property p " +
                    "JOIN p.propertyAmenities pa " +
                    "WHERE (p.propertyCategory.id = :categoryId OR :categoryId IS NULL) " +
                    "AND (pa.amenity.id IN :amenities OR :amenities IS NULL) " +
                    "AND (p.propertyType = :propertyType OR :propertyType IS NULL) " +
                    "AND (p.bookingType = :isInstant OR :isInstant IS NULL) " +
                    "AND (p.isSelfCheckIn = :isSelfCheckIn OR :isSelfCheckIn IS NULL) " +
                    "AND (p.isPetAllowed = :isPetAllowed OR :isPetAllowed IS NULL) " +
                    "AND (:minPrice <= p.basePrice AND p.basePrice <= :maxPrice) " +
                    "AND (p.numberOfBedRoom >= :room OR :room IS NULL) " +
                    "AND (p.numberOfBed >= :bed OR :bed IS NULL) " +
                    "AND (p.numberOfBathRoom >= :bathRoom OR :bathRoom IS NULL) " +
                    "AND (p.maximumGuest >= :guest OR :guest IS NULL) " +
                    "AND (p.addressCode LIKE :addressCode% OR :addressCode IS NULL) " +
                    "AND (p.status = 'PUBLIC') " +
                    "AND (p.managedCity.isManaged = true)"
    )
    Page<Property> findPropertiesWithSearchAndFilter(
            @Param("categoryId") Integer categoryId,
            @Param("name") String name,
            @Param("propertyType") String propertyType,
            @Param("amenities") List<Integer> amenities,
            @Param("isInstant") String isInstant,
            @Param("isSelfCheckIn") Boolean isSelfCheckIn,
            @Param("isPetAllowed") Boolean isPetAllowed,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("room") Integer room,
            @Param("bed") Integer bed,
            @Param("bathRoom") Integer bathRoom,
            @Param("guest") Integer guest,
            @Param("addressCode") String addressCode,
            @Param("start") Date start,
            @Param("end") Date end,
            Pageable pageable
    );


    Property findPropertyById(Integer id);

    @Query(value = "select p " +
            "from Property p " +
            "left join p.bookings pb " +
            "where p.user.id = :id " +
            "group by p.id order by SUM (pb.websiteFee) DESC  limit 1")
    Property findBestPropertyOfHost(@Param("id") Integer id);


    @Query(value = "select avg(pb.userReview.totalScore) from Property p left join p.bookings pb where p.id = :id ")
    Integer test(@Param("id") int id);
}


