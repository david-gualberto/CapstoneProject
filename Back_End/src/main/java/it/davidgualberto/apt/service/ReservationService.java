package it.davidgualberto.apt.service;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.davidgualberto.apt.entities.Reservation;
import it.davidgualberto.apt.models.ReservationUser;
import it.davidgualberto.apt.repository.ReservationRepo;

@Service
public class ReservationService {
	@Autowired
	ReservationRepo rr;
	
	public void save(Reservation e) {
		rr.save(e);
		System.out.println("Prenotazione inserita con successo");
	}
	
	public Optional<Reservation> getById(int id) {
		return rr.findById(id);
	}
	
	public List<Reservation> findAll() {
		return rr.findAll();
	}
	
	public List<Map<String, Object>> getReservationByUserASC(int id) {
		return rr.reservationsUserByDate(id);
	}
	
	public void delete(Reservation e) {
		rr.delete(e);
	}
}
