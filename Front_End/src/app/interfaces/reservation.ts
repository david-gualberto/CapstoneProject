export interface Reservation {
  idrestaurant: string;
  restaurant: string;
  numPax: number;
  date: string;
  reservationDate: string;
  hour: string;
  city: string;
}

export interface ResInfo {
  idrestaurant: string;
  reservationDate: string;
}
