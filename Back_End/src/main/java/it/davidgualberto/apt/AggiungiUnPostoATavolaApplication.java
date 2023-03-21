package it.davidgualberto.apt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;

import it.davidgualberto.apt.config.UserConfig;
import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.repository.UserRepo;

@SpringBootApplication
public class AggiungiUnPostoATavolaApplication implements CommandLineRunner {
	AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(UserConfig.class);
	@Autowired
	UserRepo ur;
	@Autowired
	PasswordEncoder pswE;
	
	public static void main(String[] args) {
		SpringApplication.run(AggiungiUnPostoATavolaApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
	//createUser();
		
	}
	
	public void createUser() {
		User u1 = (User) ctx.getBean("user", "David", "Gualberto", "gualbertodavid@gmail.com", "Totti10", pswE.encode("forzaroma"), "Roma", "Via della mendola", 51, "00122" );
		ur.save(u1);
	}

}
