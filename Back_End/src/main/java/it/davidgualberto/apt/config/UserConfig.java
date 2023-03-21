package it.davidgualberto.apt.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import it.davidgualberto.apt.entities.User;

@Configuration
public class UserConfig {
	@Bean
	@Scope("prototype")
	public User user(String n, String s, String e,String u, String p, String c, String st, int num, String pc) {
		return User.builder()
				.name(n)
				.surname(s)
				.email(e)
				.username(u)
				.password(p)
				.city(c)
				.street(st)
				.number(num)
				.postCode(pc)
				.build();
	}
}
