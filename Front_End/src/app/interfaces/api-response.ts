import { DetailsRestaurant } from "./details-restaurant";
import { Overview } from "./overview";
import { Restaurant } from "./restaurant";

//Interfacce per filtraggio ristoranti
export interface ApiResponse {
  data: Records,
  message:String,
  status:boolean,
  timestamp:number
}

export interface Records {
  data:Restaurant[]
  totalPages:number,
  totalRecords: String,
}

//Interfacce per filtraggio dettaglio ristoranti

export interface ApiResponseDetails {
  data: dataDetails,
  message:String,
  status:boolean,
  timestamp:number
}


export interface dataDetails {
  hours:any,
  location: DetailsRestaurant,
  overview:Overview,
  ownerStatus:any,
  ownerLikelihood: any,
}
