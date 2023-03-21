package it.davidgualberto.apt.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import it.davidgualberto.apt.entities.Favorite;
import it.davidgualberto.apt.repository.FavoriteRepo;

@Service
public class FavoriteService {
	@Autowired
	FavoriteRepo fr;
	
	public void save(Favorite e) {
		fr.save(e);
		System.out.println("Ristorante aggiunto ai favoriti");
	}
	
	public List<Favorite> findAll() {
		return fr.findAll();
	}
	
	public void delete(Favorite e) {
		fr.delete(e);
	}
}
