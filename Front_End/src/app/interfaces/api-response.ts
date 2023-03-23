import { DetailsRestaurant } from "./details-restaurant";
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
  location: DetailsRestaurant,
  hours:any,
  ownerStatus:any,
  ownerLikelihood: any,
  overview:any
}
