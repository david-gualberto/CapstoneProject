import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import {
  JwtResponse,
  User,
  UserProfile,
} from 'src/app/interfaces/jwt-response';
import { UserService } from 'src/app/services/user.service';
import { Reservation } from 'src/app/interfaces/reservation';
import { Favorite } from 'src/app/interfaces/restaurant';
import { Register } from 'src/app/interfaces/register';
import { ModalUserModifyConfirmComponent } from '../modal-user-modify-confirm/modal-user-modify-confirm.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  //pagination
  currentPageRes: number = 1;
  pageSizeRes: number = 3;
  currentPageFav: number = 1;
  pageSizeFav: number = 7;

  //variabili per mostrare o nascondere la password
  showPassword: boolean = false;
  passwordFieldType: string = 'password';

  //variabili per user
  user!: JwtResponse | undefined;
  userProfile!: UserProfile | undefined;
  errMessage: boolean = false;
  errUsername: boolean = false;
  emailErr : boolean = false;
  idUser!: number;
  userReservation: Reservation[] = [];
  validUserReservation: Reservation[] = [];
  displayedReservations: Reservation[] = [];
  userFavorite!: Favorite[];
  displayedFav: Favorite[] = [];

  constructor(
    private usServ: UserService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? '');
      this.user = userObj;
    }
    this.usServ.getUser(this.user!.id).subscribe((res) => {
      this.userProfile = res;
      this.idUser = this.userProfile.id;
      this.userFavorite = this.userProfile.favRestaurant;
      this.paginateFav();
    });
    this.getReservationList(this.user!.id);
  }

  getReservationList(id: number) {
    this.usServ.getReservationList(id).subscribe(
      (res: Reservation[]) => {
        this.userReservation = res;
        if (this.userReservation.length > 0) {
          this.userReservation.forEach((element) => {
            const reservationDate = new Date(element.reservationDate);
            const today = new Date();
            if (reservationDate >= today) {
              this.validUserReservation.push(element);
            }
          });
        }
        this.paginateReservations();
      },
      (error) => {
        this.displayedReservations = [];
      }
    );
  }

  onReservationDeleted(): void {
    this.validUserReservation = [];
    this.ngOnInit();
  }

  onReservationModify(): void {
    this.ngOnInit();
  }

  //Pagination Reservation
  changePageRes(pageNumber: number): void {
    this.currentPageRes = pageNumber;
    this.paginateReservations();
  }
  previousPageRes(): void {
    if (this.currentPageRes > 1) {
      this.changePageRes(this.currentPageRes - 1);
    }
  }
  nextPageRes(): void {
    if (
      this.currentPageRes <
      Math.ceil(this.userReservation.length / this.pageSizeRes)
    ) {
      this.changePageRes(this.currentPageRes + 1);
    }
  }
  paginateReservations(): void {
    const startIndex = (this.currentPageRes - 1) * this.pageSizeRes;
    this.displayedReservations = this.validUserReservation.slice(
      startIndex,
      startIndex + this.pageSizeRes
    );
  }
  pagesRes(): number[] {
    const pageCount = Math.ceil(this.userReservation.length / this.pageSizeRes);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  //pagination favorite
  changePageFav(pageNumber: number): void {
    this.currentPageFav = pageNumber;
    this.paginateFav();
  }
  previousPageFav(): void {
    if (this.currentPageFav > 1) {
      this.changePageFav(this.currentPageFav - 1);
    }
  }
  nextPageFav(): void {
    if (
      this.currentPageFav <
      Math.ceil(this.userFavorite.length / this.pageSizeFav)
    ) {
      this.changePageFav(this.currentPageFav + 1);
    }
  }
  paginateFav(): void {
    const startIndex = (this.currentPageFav - 1) * this.pageSizeFav;
    this.displayedFav = this.userFavorite.slice(
      startIndex,
      startIndex + this.pageSizeFav
    );
  }
  pagesFav(): number[] {
    const pageCount = Math.ceil(this.userFavorite.length / this.pageSizeFav);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  //modifica User
  name = false;
  surname = false;
  email = false;
  username = false;
  street = false;
  city = false;
  password = false;
  number = false;
  postCode = false;
  buttonSave = false;
  edit(x: string) {
    switch (x) {
      case 'name':
        this.name = true;
        this.buttonSave = true;
        break;
      case 'surname':
        this.surname = true;
        this.buttonSave = true;
        break;
      case 'city':
        this.city = true;
        this.buttonSave = true;
        break;
      case 'username':
        this.username = true;
        this.buttonSave = true;
        break;
      case 'email':
        this.email = true;
        this.buttonSave = true;
        break;
      case 'street':
        this.street = true;
        this.buttonSave = true;
        break;
      case 'number':
        this.number = true;
        this.buttonSave = true;
        break;
      case 'password':
        this.password = true;
        this.buttonSave = true;
        break;
      case 'postCode':
        this.postCode = true;
        this.buttonSave = true;
        break;
    }
  }

  save() {
    this.name = false;
    this.surname = false;
    this.city = false;
    this.buttonSave = false;
    this.username = false;
    this.street = false;
    this.password = false;
    this.number = false;
    this.postCode = false;
    let numParse: string = this.userProfile!.postCode.toString();
    if (numParse.length == 4 || numParse.length == 3) {
      numParse = numParse.padStart(5, '0');
    }
    let newUser: Register = {
      name: this.userProfile!.name,
      surname: this.userProfile!.surname,
      email: this.userProfile!.email,
      username: this.userProfile!.username,
      password: this.userProfile!.password,
      city: this.userProfile!.city,
      street: this.userProfile!.street,
      number: this.userProfile!.number,
      postCode: numParse,
    };
if(this.validateEmail() || !this.email) {
  if (this.userProfile!.username.length > 3) {
      this.usServ
        .updateUser(this.userProfile!.id, newUser)
        .subscribe((res) => {
          this.modalService.open(ModalUserModifyConfirmComponent);
        });
      this.errUsername = false;
      this.errMessage = false;
      this.emailErr = false;
      this.email = false;
  } else {
    this.errUsername = true;
    this.username = true;
    this.buttonSave = true;
  }
} else {
  this.emailErr = true;
  this.email = true;
  this.buttonSave = true;
}

  }

  cancel() {
    this.emailErr = false;
    this.name = false;
    this.surname = false;
    this.email = false;
    this.city = false;
    this.buttonSave = false;
    this.username = false;
    this.street = false;
    this.password = false;
    this.number = false;
    this.postCode = false;
    this.buttonSave = false;
    this.errMessage = false;
    this.errUsername = false;
    location.reload();
  }

  validatePassword(): boolean {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return (
      !!(
        this.userProfile?.password &&
        passwordPattern.test(this.userProfile.password)
      ) ?? false
    );
  }

  validateEmail(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !!(
      this.userProfile?.email &&
      emailPattern.test(this.userProfile.email)
    ) ?? false;
  }

  mostraNascondiPassword(): void {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }
}
