package it.davidgualberto.apt.controllers;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.models.AccessDetails;
import it.davidgualberto.apt.payloads.JwtResponse;
import it.davidgualberto.apt.payloads.LoginRequest;
import it.davidgualberto.apt.payloads.MessageResponse;
import it.davidgualberto.apt.payloads.RegisterRequest;
import it.davidgualberto.apt.repository.UserRepo;
import it.davidgualberto.apt.utils.JwtUtils;

@RestController
@CrossOrigin("http://localhost:4200")
public class AuthController {
	@Autowired
	AuthenticationManager aM;
	@Autowired
	UserRepo uR;
	@Autowired
	PasswordEncoder pE;
	@Autowired
	JwtUtils jU;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication a = aM.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
		return returnToken(a);
	}

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest RegisterRequest) {
		if (uR.existsByUsername(RegisterRequest.getUsername())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
		}

		if (uR.existsByEmail(RegisterRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
		}
		
		// Create new user's account
		User user = User.builder().name(RegisterRequest.getName())
				.surname(RegisterRequest.getSurname())
								
								  .email(RegisterRequest.getEmail())
								  .username(RegisterRequest.getUsername())
								  .password(pE.encode(RegisterRequest.getPassword()))
								  .city(RegisterRequest.getCity())
								  .street(RegisterRequest.getStreet())
								  .number(RegisterRequest.getNumber())
								  .postCode(RegisterRequest.getPostCode())
								  .build();

		uR.save(user);
		return new ResponseEntity("Utente registrato con successo", HttpStatus.OK);
		//return returnToken(aM.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), RegisterRequest.getPassword())));
	}
	
	public ResponseEntity<?> returnToken(Authentication a) {
		SecurityContextHolder.getContext().setAuthentication(a);
		String jwt = jU.generateJwtToken(a);
		AccessDetails uD = (AccessDetails) a.getPrincipal();		
		return ResponseEntity.ok(new JwtResponse(jwt, uD.getId(), uD.getUsername(), uD.getEmail(), uD.getName(), uD.getSurname(), uD.getCity()));
	}
}
