package it.davidgualberto.apt.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import it.davidgualberto.apt.entities.Favorite;

@Configuration
public class FavoriteConfig {
	
	@Bean
	@Scope("prototype")
	public Favorite favorite(String idr, String res) {
		return Favorite.builder()
				.idrestaurant(idr)
				.restaurant(res)
				.build();
	}
}
