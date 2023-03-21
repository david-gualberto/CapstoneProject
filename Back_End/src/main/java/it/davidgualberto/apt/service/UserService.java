package it.davidgualberto.apt.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.repository.UserRepo;

@Service
public class UserService {
		@Autowired
		UserRepo ur;
		
		public void save(User e) {
			ur.save(e);
			System.out.println("Utente iscritto con successo");
		}
		
		public Optional<User> getById(int id) {
			return ur.findById(id);
		}
		
		public List<User> findAll() {
			return ur.findAll();
		}
		
		public void delete(User e) {
			ur.delete(e);
		}
}
