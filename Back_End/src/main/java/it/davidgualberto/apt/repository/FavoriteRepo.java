package it.davidgualberto.apt.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import it.davidgualberto.apt.entities.Favorite;


@Repository
public interface FavoriteRepo extends JpaRepository<Favorite, Integer> {

	@Query(nativeQuery = true, value = "SELECT u.id, f.idrestaurant FROM users u LEFT JOIN users_fav_restaurant uf ON u.id = uf.user_id LEFT JOIN favorites f ON uf.fav_restaurant_id = f.id WHERE u.id = :id")
	List<Map<String, Object>> filterByUser(@Param("id") Integer id);
}
