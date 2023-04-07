import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { catchError } from 'rxjs';
import {
  ApiResponseDetails,
  dataDetails,
} from 'src/app/interfaces/api-response';
import { DetailsRestaurant } from 'src/app/interfaces/details-restaurant';
import { Overview } from 'src/app/interfaces/overview';
import { Reservation } from 'src/app/interfaces/reservation';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ModalConfirmReservationComponent } from '../modal-confirm-reservation/modal-confirm-reservation.component';
import { User } from 'src/app/interfaces/jwt-response';
import { UserService } from 'src/app/services/user.service';
import { Favorite, FavoriteUser } from 'src/app/interfaces/restaurant';

@Component({
  selector: 'app-detail-restaurant',
  templateUrl: './detail-restaurant.component.html',
  styleUrls: ['./detail-restaurant.component.scss'],
})
export class DetailRestaurantComponent implements OnInit {
  apiResponse!: ApiResponseDetails;
  dataDetails!: dataDetails;
  overview!: Overview;
  restaurantID: string = '';
  detailRest!: DetailsRestaurant;
  ratingRest!:number;
  travelerChoice!: boolean;
  stringHtml!:string;
  err:string = "";
  f!: FormGroup;
  modalRef: MdbModalRef<ModalConfirmReservationComponent> | null = null;
  user!: User | undefined;
  isfavorite:boolean = false
  arrayFavorite: any = [];

  constructor(
    private route: ActivatedRoute,
    private resSrv: RestaurantService,
    private sanitizer: DomSanitizer,
    private modalService: MdbModalService,
    private usServ: UserService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? '');
      this.user = userObj; }
      this.resSrv.getFavorite(this.user!.id).pipe(catchError(err=>{
        throw err
      })).subscribe((res:FavoriteUser)=> {
        this.arrayFavorite = res;
        this.arrayFavorite.find((element: FavoriteUser) => {
          if (element.idrestaurant == this.restaurantID) {
              this.isfavorite = true;
          }
      });
      })

    if (this.route.snapshot.queryParamMap.get('id')) {
      this.restaurantID = this.route.snapshot.queryParamMap.get('id') ?? '';
    }
    this.f = new FormGroup({
      number: new FormControl('', [Validators.required, this.validateNumber]),
      date: new FormControl('', [ Validators.required,this.validateDate.bind(this),]),
      time: new FormControl('', [Validators.required, this.timeRangeValidator.bind(this)]),
    });
    this.resSrv
      .getDetailsRest(this.restaurantID)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((res) => {
        this.apiResponse = res;
        this.dataDetails = this.apiResponse.data;
        this.detailRest = this.dataDetails.location;
        if (this.detailRest.open_now_text.includes('Opens in')) {
          this.detailRest.open_now_text = 'Aprirà a breve';
        } else if (this.detailRest.open_now_text.includes('Open')) {
          this.detailRest.open_now_text = 'Aperto';
        } else if (
          this.detailRest.open_now_text.includes('Closed')
        ) {
          this.detailRest.open_now_text = 'Chiuso';
        }
        let stri:string = this.detailRest.rating
        this.ratingRest = parseFloat(stri);
        this.rating(this.ratingRest)
          this.translateCusine1(this.detailRest.cuisine[0].name);
          this.translateCusine2(this.detailRest.cuisine[1].name)
        this.overview = this.dataDetails.overview;
        if( this.overview.award.isTravelersChoice == true){
          this.travelerChoice = this.overview.award.isTravelersChoice;
        }
      });

  }

  addFavorite() {
    let favorite:Favorite = {
      idrestaurant: this.restaurantID,
      restaurant: this.detailRest.name
    }
    if(this.isfavorite == false) {
      this.isfavorite = true;
      this.resSrv.addToFavorite(favorite, this.user!.id).pipe(catchError(err=>{
        throw err
      })).subscribe((res)=> {
      })
    } else {
      this.isfavorite = false;
      this.resSrv.removeFavorite(favorite, this.user!.id).pipe(catchError(err=>{
        throw err
      })).subscribe((res)=> {
      })
    }

  }

  reservation(f: FormGroup) {
    const today = new Date();
    const dateString = today.toISOString().substring(0, 10);
    let reservation: Reservation = {
      idrestaurant: this.restaurantID,
      restaurant: this.detailRest.name,
      numPax: f.value.number,
      date: dateString,
      reservationDate: f.value.date,
      hour: `${f.value.time}:00`,
      city: localStorage.getItem('cityRes') ?? '',
    };
    this.resSrv
    .addreservation(reservation, this.user!.id)
    .pipe(
      catchError((err) => {
        this.err = err.error;
        if (err.status == 409) {
          console.log(this.err);
        }
        throw err;
      })
    )
    .subscribe((res) => {
      this.openModal();
    });
  }
  openModal() {
    this.modalRef = this.modalService.open(ModalConfirmReservationComponent)
  }


  rating(rating: number): SafeHtml {
    var fullStars = Math.floor(rating);
    var halfStars = rating % 1 !== 0 ? 1 : 0;
    var starsHTML = '';
    for (var i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fas fa-star"></i>';
    }
    if (halfStars) {
      starsHTML += '<i class="fas fa-star-half-stroke"></i>';
    }
    if (fullStars + halfStars < 5) {
      var emptyStars = 5 - (fullStars + halfStars);
      for (var i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
      }


  } return this.sanitizer.bypassSecurityTrustHtml(starsHTML);}

  translateCusine1(type:string){
      switch(type) {
        case 'Seafood':
        this.detailRest.cuisine[0].name = 'Di mare';
        break;
        case 'Italian':
        this.detailRest.cuisine[0].name = 'Italiana';
        break;
        case 'American':
        this.detailRest.cuisine[0].name = 'Americana';
        break;
        case 'Dining bars':
        this.detailRest.cuisine[0].name = 'Bistrot';
        break;
        case 'Northern-Italian':
        this.detailRest.cuisine[0].name = 'Nord Italia';
        break;
        case 'Filipino':
        this.detailRest.cuisine[0].name = 'Asiatico';
        break;
        case 'Japanese':
          this.detailRest.cuisine[0].name = 'Giapponese';
        break;
        case 'Middle Eastern':
          this.detailRest.cuisine[0].name = 'Mediorientale';
        break;
        case 'Iternational':
          this.detailRest.cuisine[0].name = 'Internazionale';
        break;
        case 'Indian':
          this.detailRest.cuisine[0].name = 'Indiana';
        break;
          case 'Tuscan':
            this.detailRest.cuisine[0].name = 'Cucina Toscana';
          break;
          case 'Brew Pub':
            this.detailRest.cuisine[0].name = 'Birreria';
          break;
          case 'Mediterranean':
            this.detailRest.cuisine[0].name = 'Mediterranea';
          break;
          case 'Barbecue':
            this.detailRest.cuisine[0].name = 'Barbecue';
          break;
          case 'Pizza':
            this.detailRest.cuisine[0].name = 'Pizza';
          break;
          case 'Fusion':
            this.detailRest.cuisine[0].name = 'Fusion';
          break;
          default:
            this.detailRest.cuisine[0].name = 'Bar Ristorante';
            break
      }
    }


  translateCusine2(type:string){
    switch(type) {
      case 'Seafood':
      this.detailRest.cuisine[1].name = 'Di mare';
      break;
      case 'Italian':
      this.detailRest.cuisine[1].name = 'Italiana';
      break;
      case 'American':
      this.detailRest.cuisine[1].name = 'Americana';
      break;
      case 'Dining bars':
      this.detailRest.cuisine[1].name = 'Bistrot';
      break;
      case 'Northern-Italian':
      this.detailRest.cuisine[1].name = 'Nord Italia';
      break;
      case 'Filipino':
      this.detailRest.cuisine[1].name = 'Asiatico';
      break;
      case 'Japanese':
        this.detailRest.cuisine[1].name = 'Giapponese';
      break;
      case 'Middle Eastern':
        this.detailRest.cuisine[1].name = 'Mediorientale';
      break;
      case 'Iternational':
        this.detailRest.cuisine[1].name = 'Internazionale';
      break;
      case 'Indian':
        this.detailRest.cuisine[1].name = 'Indiana';
      break;
        case 'Tuscan':
          this.detailRest.cuisine[1].name = 'Cucina Toscana';
        break;
        case 'Brew Pub':
          this.detailRest.cuisine[1].name = 'Birreria';
        break;
        case 'Mediterranean':
          this.detailRest.cuisine[1].name = 'Mediterranea';
        break;
        case 'Barbecue':
          this.detailRest.cuisine[1].name = 'Barbecue';
        break;
        case 'Pizza':
          this.detailRest.cuisine[1].name = 'Pizza';
        break;
        case 'Fusion':
          this.detailRest.cuisine[1].name = 'Fusion';
        break;
        default:
          this.detailRest.cuisine[1].name = 'Mediterranea';
          break
    }
  }

  validateNumber(control: FormControl): { [key: string]: any } | null {
    const num = Number(control.value);
    if (isNaN(num) || num > 8) {
      return { invalidNumber: true };
    }
    return null;
  }

  validateDate(control: FormControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Imposta l'ora a 00:00:00:000

    if (selectedDate < today) {
      return { invalidDate: true };
    }
    return null;
  }

  timeRangeValidator(control: AbstractControl): {[key: string]: boolean} | null {
    const value = control.value;
    const validHours = [12, 13, 14, 19, 20, 21, 22];
    const [hours, minutes] = value.split(':').map(Number);
    if (validHours.includes(hours) && minutes >= 0 && minutes <= 59) {
      return null;
    } else {
      return { invalidTime: true };
    }
  }
  }


