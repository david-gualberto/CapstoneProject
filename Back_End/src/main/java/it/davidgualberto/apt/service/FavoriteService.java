package it.davidgualberto.apt.service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.davidgualberto.apt.entities.Favorite;
import it.davidgualberto.apt.models.FavoriteUser;
import it.davidgualberto.apt.repository.FavoriteRepo;

@Service
public class FavoriteService {
	@Autowired
	FavoriteRepo fr;
	
	public void save(Favorite e) {
		fr.save(e);
	}
	
	public List<Favorite> findAll() {
		return fr.findAll();
	}
	
	public Optional<Favorite> getById(int id) {
		return fr.findById(id);
	}
	
	public List<Map<String, Object>> getByUser(int id) {
		return fr.filterByUser(id);
	}
	
	public void delete(Favorite e) {
		fr.delete(e);
	}
}
