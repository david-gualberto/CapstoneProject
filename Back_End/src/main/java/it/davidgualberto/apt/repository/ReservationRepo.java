package it.davidgualberto.apt.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import it.davidgualberto.apt.entities.Reservation;

@Repository
public interface ReservationRepo extends JpaRepository<Reservation, Integer> {

}
