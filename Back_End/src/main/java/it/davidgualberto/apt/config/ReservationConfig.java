package it.davidgualberto.apt.config;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import it.davidgualberto.apt.entities.Reservation;

@Configuration
public class ReservationConfig {
	@Bean
	@Scope("prototype")
	public Reservation reservation(String idr, String res,int num, LocalDate d, LocalDate rd, LocalTime h, String c) {
		return Reservation.builder()
				.idrestaurant(idr)
				.restaurant(res)
				.numPax(num)
				.date(d)
				.reservationDate(rd)
				.hour(LocalTime.of(h.getHour(), h.getMinute()))
				.city(c)
				.build();
	}
}
