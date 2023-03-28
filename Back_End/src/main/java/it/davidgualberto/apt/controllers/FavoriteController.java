package it.davidgualberto.apt.controllers;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import it.davidgualberto.apt.entities.Favorite;
import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.service.FavoriteService;
import it.davidgualberto.apt.service.UserService;

@RestController
@CrossOrigin("http://localhost:4200")
public class FavoriteController {
	@Autowired
	UserService us;

	@Autowired
	FavoriteService fs;

	@PostMapping("/addFavorite_user={id}")
	public ResponseEntity<?> addFavorite(@Valid @RequestBody Favorite f, @PathVariable Integer id) {
		Optional<User> UserObj = us.getById(id);
		if (!UserObj.isPresent()) {
			return new ResponseEntity<>("UTENTE NON TROVATO", HttpStatus.NOT_FOUND);
		} else {
			User x = UserObj.get();
			List<Favorite> list = x.getFavRestaurant();
			list.add(f);
			x.setFavRestaurant(list);
			us.save(x);
			return new ResponseEntity<>("Ristorante aggiunto ai favoriti", HttpStatus.OK);
		}

	}

	@PostMapping("/removeFavorite{idFav}_user={id}")
	public ResponseEntity<?> removeFavorite(@Valid @PathVariable Integer idFav, @PathVariable Integer id) {
		Optional<User> userObj = us.getById(id);
		if (!userObj.isPresent()) {
			return new ResponseEntity<>("UTENTE NON TROVATO", HttpStatus.NOT_FOUND);
		}
		User user = userObj.get();
		List<Favorite> favorites = user.getFavRestaurant();
		Optional<Favorite> favObj = fs.getById(idFav);
		if (!favObj.isPresent()) {
			return new ResponseEntity<>("FAVORITO NON TROVATO", HttpStatus.NOT_FOUND);
		}
		Favorite favoriteToDelete = favObj.get();
		boolean favoriteFound = false;
		for (Favorite favorite : favorites) {
			if (favorite.equals(favoriteToDelete)) {
				favorites.remove(favorite);
				user.setFavRestaurant(favorites);
				us.save(user);
				favoriteFound = true;
				break;
			}
		}
		if (favoriteFound) {
			return new ResponseEntity<>("Ristorante rimosso dai favoriti", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("FAVORITO NON TROVATO", HttpStatus.NOT_FOUND);
		}
	}
}
