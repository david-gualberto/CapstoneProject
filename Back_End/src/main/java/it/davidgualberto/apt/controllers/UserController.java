package it.davidgualberto.apt.controllers;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.service.ReservationService;
import it.davidgualberto.apt.service.UserService;

@RestController
@CrossOrigin("http://localhost:4200")
public class UserController {

	@Autowired
	UserService us;
	@Autowired
	PasswordEncoder pE;
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
	
	@PutMapping("user/update/{id}")
	public ResponseEntity<Object> updateUser(@PathVariable Integer id, @RequestBody User u) {
		Optional<User> utObj = us.getById(id);
		if( !utObj.isPresent()) {
			return new ResponseEntity<>("UTENTE NON TROVATO",HttpStatus.NOT_FOUND);
		}
		User x = utObj.get();
		x.setName(u.getName());
		x.setSurname(u.getSurname());
		x.setEmail(u.getEmail());
		x.setUsername(u.getUsername());
		if(!u.getPassword().equals(x.getPassword())) {
			x.setPassword(pE.encode(u.getPassword()));
		}
		x.setCity(u.getCity());
		x.setStreet(u.getStreet());
		x.setNumber(u.getNumber());
		x.setPostCode(u.getPostCode());
		us.save(x);
		return new ResponseEntity<>(x, HttpStatus.OK);
	}
}
