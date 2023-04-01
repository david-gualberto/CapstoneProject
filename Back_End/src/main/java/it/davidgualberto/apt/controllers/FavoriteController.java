package it.davidgualberto.apt.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import it.davidgualberto.apt.entities.Favorite;
import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.models.FavoriteUser;
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
			return new ResponseEntity<>(list, HttpStatus.OK);
		}

	}

	@PostMapping("/removeFavorite/{id}")
	public ResponseEntity<?> removeFavorite(@Valid @RequestBody Favorite f, @PathVariable Integer id) {
		Optional<User> UserObj = us.getById(id);
		if (!UserObj.isPresent()) {
			return new ResponseEntity<>("UTENTE NON TROVATO", HttpStatus.NOT_FOUND);
		} else {
			User x = UserObj.get();
			Favorite w = null;
			List <Favorite> list = x.getFavRestaurant();
			String idDelete = f.getIdrestaurant();
			List <Favorite> newList = new ArrayList<>();
			for (Favorite fav : list) {
			    if (!fav.getIdrestaurant().equals(idDelete)) {
			        newList.add(fav);
			    }
			    else {
			    	if (list.contains(fav)) {
	                    w=fav;
	                }
			    }
			}
			x.setFavRestaurant(newList);
			us.save(x);
			fs.delete(w);
			return new ResponseEntity<>(newList,HttpStatus.OK);
		}
	}
	
	@GetMapping("/getfavorite/{id}")
	public ResponseEntity<?> getAllFavorite(@Valid @PathVariable Integer id) {
		List<Map<String, Object>> list = fs.getByUser(id);
		List<FavoriteUser> result = new ArrayList<>();
		for (Map<String, Object> map : list) {
		Integer userId = (Integer) map.get("id");
		String restaurantId = (String) map.get("idrestaurant");
		result.add(new FavoriteUser(userId, restaurantId));
		}
		return new ResponseEntity<>(result, HttpStatus.OK);
		}
}
