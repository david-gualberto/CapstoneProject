package it.davidgualberto.apt.repository;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import it.davidgualberto.apt.entities.Reservation;
import it.davidgualberto.apt.models.ReservationUser;

@Repository
public interface ReservationRepo extends JpaRepository<Reservation, Integer> {

		@Query(nativeQuery = true, value = "SELECT u.id, s.idrestaurant, s.restaurant, s.num_pax, s.date, s.reservation_date, s.hour, s.city FROM users u LEFT JOIN users_reservation ur ON u.id = ur.user_id LEFT JOIN reservations s ON ur.reservation_id = s.id WHERE u.id = :id  ORDER BY reservation_date ASC")
		List<Map<String, Object>> reservationsUserByDate(@Param("id") Integer id);
	
}
