import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { ApiResponse, ApiResponseDetails } from '../interfaces/api-response';
import { Reservation } from '../interfaces/reservation';
import { Favorite, FavoriteUser } from '../interfaces/restaurant';
import { DetailsRestaurant } from '../interfaces/details-restaurant';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {

  urlLocation: String =
    'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId=';
   favoriteUrl: string = "http://localhost:9090/addFavorite_user=";
   removeFavoriteUrl:string = "http://localhost:9090/removeFavorite/";
   reservationUrl:string = "http://localhost:9090/reservation_user=";

  options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f626c50c6cmshbab12a633576088p15483bjsneebb2b954045',
      'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com',
    },
  };

  constructor(private http: HttpClient) {}

  getRestaurantByCity(city: string) {
    let idCity = 0;
    switch (city) {
      case 'Roma':
        idCity = 187791;
        break;
      case 'Milano':
        idCity = 187849;
        break;
      case 'Napoli':
        idCity = 187785;
        break;
      case 'Firenze':
        idCity = 187895;
        break;
      case 'Torino':
        idCity = 187855;
        break;
      case 'Venezia':
        idCity = 187870;
        break;
      case 'Palermo':
        idCity = 187890;
        break;
    }
    return this.http
      .get<ApiResponse>(`${this.urlLocation}${idCity}`, this.options)
      .pipe(
        catchError((err) => {
          throw err;
        })
      );
  }

  addToFavorite(favorite:Favorite, userID:number){
    return this.http.post<Favorite>(`${this.favoriteUrl}${userID}`, favorite)
  }

  removeFavorite(favorite:Favorite, userID:number){
    return this.http.post<Favorite>(`${this.removeFavoriteUrl}${userID}`, favorite)
  }

  getFavorite(userID:number) {
    return this.http.get<FavoriteUser>(`http://localhost:9090/getfavorite/${userID}`).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  addreservation(reservation:Reservation, userID:number){
    return this.http.post<Favorite>(`${this.reservationUrl}${userID}`, reservation).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  getDetailsRest(id:string){
    return this.http.get<ApiResponseDetails>(`https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/getRestaurantDetails?restaurantsId=${id}`, this.options).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }
}
