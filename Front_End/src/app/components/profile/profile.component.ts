import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { JwtResponse, User, UserProfile } from 'src/app/interfaces/jwt-response';
import { UserService } from 'src/app/services/user.service';
import { ModalUpdateUserComponent } from '../modal-update-user/modal-update-user.component';
import { Reservation } from 'src/app/interfaces/reservation';
import { Favorite } from 'src/app/interfaces/restaurant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  //variabili per dati utente
  user!: JwtResponse | undefined;
  userProfile!: UserProfile | undefined;
  newSurname = '';
  password:string = "";
  idUser!: number;
  userReservation!: Reservation[];
  userFavorite!: Favorite[];
  currentPage: number = 1; // pagina corrente
  itemsPerPage: number = 3; // numero di elementi per pagina

  constructor(private usServ: UserService, private router: Router, private modalService: MdbModalService) {}

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? '');
      this.user = userObj;
    }
    this.usServ.getUser(this.user!.id).subscribe((res) => {
      this.userProfile = res;
      this.idUser = this.userProfile.id;
      this.userReservation = this.userProfile.reservation
      this.userFavorite = this.userProfile.favRestaurant
    });
  }

  openModal() {
    this.modalService.open(ModalUpdateUserComponent);
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

}
