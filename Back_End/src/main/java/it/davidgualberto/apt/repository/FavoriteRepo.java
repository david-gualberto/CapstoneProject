package it.davidgualberto.apt.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.davidgualberto.apt.entities.Favorite;

@Repository
public interface FavoriteRepo extends JpaRepository<Favorite, Integer> {

}
