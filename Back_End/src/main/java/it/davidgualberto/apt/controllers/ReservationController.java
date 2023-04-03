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
	public ResponseEntity<?> removeFavorite(@Valid @RequestBody Reservation r, @PathVariable Integer id) {
		Optional<User> UserObj = us.getById(id);
		if (!UserObj.isPresent()) {
			return new ResponseEntity<>("UTENTE NON TROVATO", HttpStatus.NOT_FOUND);
		} else {
			User x = UserObj.get();
			Reservation w = null;
			List <Reservation> list = x.getReservation();
			LocalDate resDate = r.getReservationDate();
			String restaurantId = r.getIdrestaurant();
			List <Reservation> newList = new ArrayList<>();
			for (Reservation res : list) {
			    if (!res.getIdrestaurant().equals(restaurantId) && !res.getReservationDate().isEqual(resDate)) {
			        newList.add(res);
			    }
			    else {
			    	if (list.contains(res)) {
	                    w=res;
	                }
			    }
			}
			x.setReservation(newList);
			us.save(x);
			rs.delete(w);
			return new ResponseEntity<>(newList,HttpStatus.OK);
		}
	}
	
	@PutMapping("/updateRes/user/{id}/reservation/{date}/{idres}")
	public ResponseEntity<?> updateRes(@Valid @RequestBody Reservation r, @PathVariable Integer id, @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date,@PathVariable String idres ){
	    Optional<User> UserObj = us.getById(id);
	    if (!UserObj.isPresent()) {
	        return new ResponseEntity<>("UTENTE NON TROVATO", HttpStatus.NOT_FOUND);
	    } else {
	        User x = UserObj.get();
	        List<Reservation> reservations = x.getReservation();
	        boolean found = false;
	        for (int i = 0; i < reservations.size(); i++) {
	            if (reservations.get(i).getIdrestaurant().equals(idres) && reservations.get(i).getReservationDate().isEqual(date) ) {
	                found = true;
	                Reservation updatedReservation = reservations.get(i);
	                updatedReservation.setReservationDate(r.getReservationDate());
	                updatedReservation.setHour(r.getHour());
	                updatedReservation.setNumPax(r.getNumPax());
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
