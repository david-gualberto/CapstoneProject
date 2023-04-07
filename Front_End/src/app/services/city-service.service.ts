import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityServiceService {
  private city: string | null = null;
  constructor() { }

  getCity(): string | null {
    return this.city;
  }

  setCity(city: string | null) {
    this.city = city;
  }
}
