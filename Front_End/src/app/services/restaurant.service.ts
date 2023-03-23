import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';


@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  idRome:number = 187791;
  idMilan:number = 187849;
  idNaples:number = 187785;
  idFlorence:number = 187895;
  idTurin:number =187855;
  idVenice:number = 187870;
  idPalermo:number = 187890;


  urlLocation: String = "https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants?locationId="

   options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f626c50c6cmshbab12a633576088p15483bjsneebb2b954045',
      'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
    }
    };

  constructor(private http: HttpClient) {}

  getRestaurantRome() {
  return this.http.get<ApiResponse>(`${this.urlLocation}${this.idRome}`, this.options).pipe(catchError(err=>{
    throw err
  }))
  }

}
