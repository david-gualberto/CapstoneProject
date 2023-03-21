import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

   options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f626c50c6cmshbab12a633576088p15483bjsneebb2b954045',
      'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
    }
    };

  constructor(private http: HttpClient) { }


}
