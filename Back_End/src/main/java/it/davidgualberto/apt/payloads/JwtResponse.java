package it.davidgualberto.apt.payloads;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private int id;
	private String username;
	private String email;
	private String name;
	private String surname;
	private String city;
	
	public JwtResponse(String accessToken, int id, String username, String email, String name, String surname, String city) {
		this.token = accessToken;
		this.id = id;
		this.username = username;
		this.email = email;
		this.name = name;
		this.surname = surname;
		this.city = city;
		}
}
