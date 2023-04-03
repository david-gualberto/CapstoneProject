package it.davidgualberto.apt.models;

import java.time.LocalDate;

import lombok.Data;
@Data
public class ResUpdate {
	private String restaurantid;
	private LocalDate reservationDate;

}
