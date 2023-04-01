import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { catchError } from 'rxjs';
import { JwtResponse } from 'src/app/interfaces/jwt-response';
import { Reservation } from 'src/app/interfaces/reservation';
import { Favorite } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ModalConfirmReservationComponent } from '../modal-confirm-reservation/modal-confirm-reservation.component';

@Component({
  selector: 'app-modal-reservation',
  templateUrl: './modal-reservation.component.html',
  styleUrls: ['./modal-reservation.component.scss'],
})
export class ModalReservationComponent implements OnInit {
  tooManyPeople: boolean = false;
  //for e dati del form
  f!: FormGroup;
  info!: Favorite;
  city!: string;
  err!: string;
  //variabili per dati utente
  user!: JwtResponse | undefined;


  constructor( public modalRef: MdbModalRef<ModalReservationComponent>,private resSrv: RestaurantService, private modalService: MdbModalService) {}

  ngOnInit(): void {
    if (localStorage.getItem('infores')) {
      const infoResObj = JSON.parse(localStorage.getItem('infores') ?? '');
      this.info = infoResObj;
    }
    const userObj = JSON.parse(localStorage.getItem('user') ?? '');
    this.user = userObj;
    this.f = new FormGroup({
      number: new FormControl('', [Validators.required, this.validateNumber]),
      date: new FormControl('', [ Validators.required,this.validateDate.bind(this),]),
      time: new FormControl('', [Validators.required, this.timeRangeValidator.bind(this)]),
    });
  }

  reservation(f: FormGroup) {
    const today = new Date();
    const dateString = today.toISOString().substring(0, 10);
    let reservation: Reservation = {
      idrestaurant: this.info.idrestaurant,
      restaurant: this.info.restaurant,
      numPax: f.value.number,
      date: dateString,
      reservationDate: f.value.date,
      hour: `${f.value.time}:00`,
      city: localStorage.getItem('cityRes') ?? '',
    };
    localStorage.removeItem('infores');
    localStorage.removeItem('cityRes');
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
        this.modalRef.close()
        this.openModal();
      });
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

  openModal() {
    this.modalRef = this.modalService.open(ModalConfirmReservationComponent)
  }
}
