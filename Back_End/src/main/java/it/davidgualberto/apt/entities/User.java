package it.davidgualberto.apt.entities;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class User {
		
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@NotBlank
	private String name;
	@NotBlank
	private String surname;
	@NotBlank
	@Email
	private String email;
	@NotBlank
	@Size(min = 3)
	private String username;
	@NotBlank
	private String password;
	@NotBlank
	private String city;
	@NotBlank
	private String street;
	@NotNull
	private int number;
	@NotBlank
	private String postCode;
	
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Reservation> reservation;
	
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Favorite> favRestaurant;
	
	public User(String name, String surname, String email, String username, String password, String city, String street, int number, String postCode) {
		this.name = name;
		this.surname = surname;
		this.email = email;
		this.username = username;
	
		// Validazione della password con regex
		if (!password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")) {
			throw new IllegalArgumentException("La password non soddisfa i requisiti minimi");
		}
		this.password = password;
		
		this.city = city;
		this.street = street;
		this.number = number;
		this.postCode = postCode;
	}
	
}
