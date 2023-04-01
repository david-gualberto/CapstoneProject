package it.davidgualberto.apt.models;

import lombok.Data;

@Data
public class FavoriteUser {
		private Integer id;
		private String idrestaurant; 
		
		public FavoriteUser(Integer id, String idrestaurant) {
			this.id = id;
			this.idrestaurant = idrestaurant;
			
		}

}
