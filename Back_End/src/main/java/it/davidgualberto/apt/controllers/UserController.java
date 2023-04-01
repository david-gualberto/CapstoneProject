package it.davidgualberto.apt.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import it.davidgualberto.apt.entities.Reservation;
import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.service.ReservationService;
import it.davidgualberto.apt.service.UserService;

@RestController
@CrossOrigin("http://localhost:4200")
public class UserController {

	@Autowired
	UserService us;

	@Autowired
	ReservationService rs;
	
	@GetMapping("user/{id}")
	public ResponseEntity<Object> getById(@PathVariable Integer id) {
		Optional<User> utObj = us.getById(id);
		if( !utObj.isPresent()) {
			return new ResponseEntity<>("UTENTE NON TROVATO",HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(utObj.get(), HttpStatus.OK);
	}
}
