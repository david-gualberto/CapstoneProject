import { Component, Input, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { catchError } from 'rxjs';
import { JwtResponse } from 'src/app/interfaces/jwt-response';
import { Favorite, FavoriteUser, Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ModalReservationComponent } from '../modal-reservation/modal-reservation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  isfavorite:boolean = false

  @Input('restaurant')
  restaurant!: Restaurant;
  restaurantID:string = "";
  restaurantName:string = "";
  restaurantCity: string = "";
  user!:JwtResponse;
  arrayFavorite: any = [];

   //modale
   modalRef: MdbModalRef<ModalReservationComponent> | null = null;

  constructor(private resSrv:RestaurantService, private modalService: MdbModalService, private r:Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? '');
      this.user = userObj;
      this.resSrv.getFavorite(this.user.id).pipe(catchError(err=>{
        throw err
      })).subscribe((res:FavoriteUser)=> {
        this.arrayFavorite = res;
        this.arrayFavorite.find((element: FavoriteUser) => {
          if (element.idrestaurant == this.restaurant.restaurantsId) {
              this.isfavorite = true;
          }
      });
      })
    }
  }

  openModal() {
    console.log(this.restaurant)
    this.restaurantLocation(this.restaurant.parentGeoName);
    let infoRes:Favorite = {
      idrestaurant: this.restaurant.restaurantsId,
      restaurant: this.restaurant.name
    }

    localStorage.setItem("infores",JSON.stringify(infoRes))
    localStorage.setItem("cityRes",this.restaurantCity)
    this.modalRef = this.modalService.open(ModalReservationComponent)

  }

  addFavorite() {
    this.restaurantID = this.restaurant.restaurantsId;
    this.restaurantName = this.restaurant.name;
    let favorite:Favorite = {
      idrestaurant: this.restaurantID,
      restaurant: this.restaurantName
    }
    if(this.isfavorite == false) {
      this.isfavorite = true;
      this.resSrv.addToFavorite(favorite, this.user.id).pipe(catchError(err=>{
        throw err
      })).subscribe((res)=> {
      })
    } else {
      this.isfavorite = false;
      this.resSrv.removeFavorite(favorite, this.user.id).pipe(catchError(err=>{
        throw err
      })).subscribe((res)=> {
      })
    }

  }

  restaurantLocation(city:string) {
    switch(city){
      case "Florence":
      this.restaurantCity= "Firenze";
      break;
      case "Milan":
      this.restaurantCity= "Milano";
      break;
      case "Naples":
      this.restaurantCity= "Napoli";
      break;
      case "Sicily":
      this.restaurantCity= "Palermo";
      break;
      case "Rome":
      this.restaurantCity= "Roma";
      break;
      case "Turin":
      this.restaurantCity= "Torino";
      break;
      case "Venice":
      this.restaurantCity= "Venezia";
      break;
    }
  }

  detailRes(){
    this.r.navigate(['details'], { queryParams: { id: this.restaurant.restaurantsId } });
  }

}
