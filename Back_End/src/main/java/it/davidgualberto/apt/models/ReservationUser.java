package it.davidgualberto.apt.models;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ReservationUser {
	 @JsonProperty("idrestaurant")
	 private String idrestaurant;

	    @JsonProperty("restaurant")
	    private String restaurant;

	    @JsonProperty("numPax")
	    private int numPax;

	    @JsonProperty("date")
	    private LocalDate date;

	    @JsonProperty("reservationDate")
	    private LocalDate reservationDate;

	    @JsonProperty("hour")
	    private LocalTime hour;

	    @JsonProperty("city")
	    private String city;
	 
	public ReservationUser(String idrestaurant, String restaurant, int numPax, LocalDate date, LocalDate reservationDate,
			LocalTime hour, String city) {
		this.idrestaurant = idrestaurant;
		this.restaurant = restaurant;
		this.numPax = numPax;
		this.date = date;
		this.reservationDate = reservationDate;
		this.hour = hour;
		this.city = city;
	}
}
