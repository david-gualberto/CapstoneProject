package it.davidgualberto.apt.entities;
import java.time.LocalDate;
import java.time.LocalTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="reservations")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Reservation {
	
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private int id;
		private String idrestaurant;
		private String restaurant;
		private int numPax;
		private LocalDate date;
		private LocalDate reservationDate;
		private LocalTime hour;
		private String city;
		
}
