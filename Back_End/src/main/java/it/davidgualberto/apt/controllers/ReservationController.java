package it.davidgualberto.apt.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.davidgualberto.apt.entities.Reservation;
import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.service.ReservationService;
import it.davidgualberto.apt.service.UserService;

@RestController
@CrossOrigin("http://localhost:4200")
public class ReservationController {

	@Autowired
	UserService us;
	
	@Autowired
	ReservationService rs;

	@PostMapping("/reservation_user={id}")
	public ResponseEntity<?> addReservation(@Valid @RequestBody Reservation r, @PathVariable Integer id) {

		if (r.getReservationDate().isBefore(LocalDate.now())) {
			return new ResponseEntity<>("Attenzione! La data inserita non è corretta", HttpStatus.BAD_REQUEST);
		} else {
			Optional<User> UserObj = us.getById(id);
			if (!UserObj.isPresent()) {
				return new ResponseEntity<>("UTENTE NON TROVATO", HttpStatus.NOT_FOUND);
			} else {
				User x = UserObj.get();
				List<Reservation> list = x.getReservation();
				if (!list.isEmpty()) {
					for (Reservation reservation : list) {
						if (reservation.getReservationDate().equals(r.getReservationDate())) {
							return new ResponseEntity<>("Hai già una prenotazione in corso per questa data", HttpStatus.CONFLICT);
						}
					}
				} 
					list.add(r);
					x.setReservation(list);
					us.save(x);
					return new ResponseEntity<>(HttpStatus.OK);
			}
		}

	}
	
	@PostMapping("/user={idUser}_reservation={idRes}")
	public ResponseEntity<?> deleteUserReservation(@PathVariable Integer idRes, @PathVariable Integer idUser) {
		Optional<User> userObj = us.getById(idUser);
		if (!userObj.isPresent()) {
			return new ResponseEntity<>("UTENTE NON TROVATO", HttpStatus.NOT_FOUND);
		}
		User user = userObj.get();
		List<Reservation> reservations = user.getReservation();
		Optional<Reservation> resObj = rs.getById(idRes);
		if (!resObj.isPresent()) {
			return new ResponseEntity<>("PRENOTAZIONE NON TROVATA", HttpStatus.NOT_FOUND);
		}
		Reservation reservationToDelete = resObj.get();
		boolean reservationFound = false;
		for (Reservation reservation : reservations) {
			if (reservation.equals(reservationToDelete)) {
				reservations.remove(reservation);
				user.setReservation(reservations);
				us.save(user);
				reservationFound = true;
				break;
			}
		}
		if (reservationFound) {
			return new ResponseEntity<>("Prenotazione cancellata", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("PRENOTAZIONE NON TROVATA", HttpStatus.NOT_FOUND);
		}
	}
	
}
