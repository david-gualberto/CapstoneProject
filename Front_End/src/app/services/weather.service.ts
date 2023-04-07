import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { WeatherAPI } from '../interfaces/weather-api';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f626c50c6cmshbab12a633576088p15483bjsneebb2b954045',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
    },
  };

  getWeather(city: string): Observable<WeatherAPI> {
    let cityWeather = '';
    switch (city) {
      case 'Roma':
        cityWeather = 'Rome';
        break;
      case 'Milano':
        cityWeather = 'Milan';
        break;
      case 'Torino':
        cityWeather = 'Turin';
        break;
      case 'Venezia':
        cityWeather = 'Venice';
        break;
      case 'Palermo':
        cityWeather = 'Palermo';
        break;
      case 'Napoli':
        cityWeather = 'Naples';
        break;
      case 'Firenze':
        cityWeather = 'Florence';
        break;
    }

    return this.http
      .get<WeatherAPI>(
        `https://weatherapi-com.p.rapidapi.com/current.json?q=${cityWeather}`,
        this.options
      )
      .pipe(
        catchError((err) => {
          throw err;
        }),
        map((response) => response as WeatherAPI)
      );
  }
}
