package it.davidgualberto.apt.payloads;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
	@NotBlank
	private String name;
	@NotBlank
	@Size(min = 3)
	private String surname;
	@NotBlank
	@Email
	private String email;
	@NotBlank
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
}
