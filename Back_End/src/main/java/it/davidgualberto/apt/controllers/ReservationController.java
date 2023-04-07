package it.davidgualberto.apt.controllers;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.davidgualberto.apt.entities.Favorite;
import it.davidgualberto.apt.entities.Reservation;
import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.models.FavoriteUser;
import it.davidgualberto.apt.models.ResUpdate;
import it.davidgualberto.apt.models.ReservationUser;
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
	
	
	@GetMapping("/getreservation/{id}")
	public ResponseEntity<List<ReservationUser>> getReservationByUser(@PathVariable Integer id) {
	    List<Map<String, Object>> reservations = rs.getReservationByUserASC(id);
	    List<ReservationUser> reservationUserList = new ArrayList<>();
	    for (Map<String, Object> reservation : reservations) {
	        String idrestaurant = (String) reservation.get("idrestaurant");
	        String restaurant = (String) reservation.get("restaurant");
	        Integer numPax = (Integer) reservation.get("num_pax");
	        LocalDate date = ((java.sql.Date) reservation.get("date")).toLocalDate();
	        LocalDate resdate = ((java.sql.Date) reservation.get("reservation_date")).toLocalDate();
	        LocalTime time = ((java.sql.Time) reservation.get("hour")).toLocalTime(); 
	        String city = (String) reservation.get("city");
	        reservationUserList.add(new ReservationUser(idrestaurant, restaurant, numPax, date, resdate, time, city));
	    }
	    return new ResponseEntity<>(reservationUserList, HttpStatus.OK);
	}
	
	@PostMapping("/removeReservation/{id}")
	public ResponseEntity<?> removeReservation(@Valid @RequestBody Reservation r, @PathVariable Integer id) {
	    Optional<User> userObj = us.getById(id);
	    if (!userObj.isPresent()) {
	        return new ResponseEntity<>("UTENTE NON TROVATO", HttpStatus.NOT_FOUND);
	    }
	    User user = userObj.get();
	    LocalDate reservationDate = r.getReservationDate();
	    String restaurantId = r.getIdrestaurant();
	    List<Reservation> reservations = user.getReservation();
	    List<Reservation> newReservations = new ArrayList<>();
	    Reservation reservationToDelete = null;
	    for (Reservation reservation : reservations) {
	        if (reservation.getIdrestaurant().equals(restaurantId) && reservation.getReservationDate().isEqual(reservationDate)) {
	            reservationToDelete = reservation;
	        } else {
	            newReservations.add(reservation);
	        }
	    }
	    if (reservationToDelete != null) {
	        newReservations.remove(reservationToDelete);
	        user.setReservation(newReservations);
	        us.save(user);
	        rs.delete(reservationToDelete);
	        return new ResponseEntity<>(newReservations, HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>("PRENOTAZIONE NON TROVATA", HttpStatus.NOT_FOUND);
	    }
	}
	
	@PutMapping("/updateRes/user/{id}/reservation/{date}/{idres}")
	public ResponseEntity<?> updateRes(@Valid @RequestBody Reservation r, @PathVariable Integer id, 
	                                    @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date, 
	                                    @PathVariable String idres) {
	    Optional<User> UserObj = us.getById(id);
	    if (!UserObj.isPresent()) {
	        return new ResponseEntity<>("UTENTE NON TROVATO", HttpStatus.NOT_FOUND);
	    } else {
	        User x = UserObj.get();
	        List<Reservation> reservations = x.getReservation();
	        boolean found = false;
	        for (int i = 0; i < reservations.size(); i++) {
	            if (reservations.get(i).getIdrestaurant().equals(idres) && reservations.get(i).getReservationDate().isEqual(date)) {
	                found = true;
	                Reservation existingReservation = reservations.get(i);
	                if (existingReservation.getReservationDate().isEqual(r.getReservationDate())) {
	                    // new reservation date is the same as the existing one
	                    return new ResponseEntity<>("La nuova data di prenotazione è identica a quella esistente", HttpStatus.BAD_REQUEST);
	                }
	                // check if the new reservation date is already booked
	                for (Reservation res : reservations) {
	                    if (res.getReservationDate().equals(r.getReservationDate())) {
	                        return new ResponseEntity<>("La data di prenotazione selezionata è già stata prenotata", HttpStatus.CONFLICT);
	                    }
	                }
	                // update the existing reservation
	                existingReservation.setReservationDate(r.getReservationDate());
	                existingReservation.setHour(r.getHour());
	                existingReservation.setNumPax(r.getNumPax());
	                us.save(x);
	                break;
	            }
	        }
	        if (!found) {
	            return new ResponseEntity<>("PRENOTAZIONE NON TROVATA", HttpStatus.NOT_FOUND);
	        } else {
	            return new ResponseEntity<>(HttpStatus.OK);
	        }
	    }
	}
	
	
}
