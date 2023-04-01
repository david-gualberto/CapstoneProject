import { Reservation } from "./reservation";
import { Favorite } from "./restaurant";

export interface JwtResponse {
token: string,
type: string,
id: number,
username: string,
email:string,
name:string,
surname:string,
city:string
}

export interface User {
  id:number;
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  city: string;
  street: string;
  number: number;
  postCode: number;
  }

  export interface UserProfile {
    id:number;
    name: string;
    surname: string;
    email: string;
    username: string;
    password: string;
    city: string;
    street: string;
    number: number;
    postCode: number;
    reservation: Reservation[];
    favRestaurant: Favorite[];
    }
