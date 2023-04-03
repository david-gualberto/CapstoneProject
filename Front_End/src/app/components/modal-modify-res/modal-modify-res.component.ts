import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { catchError } from 'rxjs';
import { JwtResponse } from 'src/app/interfaces/jwt-response';
import { ResInfo, Reservation } from 'src/app/interfaces/reservation';
import { Favorite } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserService } from 'src/app/services/user.service';
import { ModalConfirmModifyComponent } from '../modal-confirm-modify/modal-confirm-modify.component';

@Component({
  selector: 'app-modal-modify-res',
  templateUrl: './modal-modify-res.component.html',
  styleUrls: ['./modal-modify-res.component.scss']
})
export class ModalModifyResComponent implements OnInit {

  tooManyPeople: boolean = false;
  reservationToModify!:Reservation;
  //for e dati del form
  f!: FormGroup;
  info!:string;
  err!: string;
  //variabili per dati utente
  user!: JwtResponse | undefined;

  @Output() reservationModify = new EventEmitter<void>();
  constructor(public modalRef: MdbModalRef<ModalModifyResComponent>,private usServ:UserService, private modalService: MdbModalService) {}


  ngOnInit(): void {
    if (localStorage.getItem('res')) {
      this.reservationToModify!  = JSON.parse(localStorage.getItem('res') ?? '');
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
    let resInfo: ResInfo = {
      idrestaurant: this.reservationToModify.idrestaurant,
      reservationDate: this.reservationToModify.reservationDate
    }
     let newReservation: Reservation = {
       idrestaurant: this.reservationToModify.idrestaurant,
       restaurant: this.reservationToModify.restaurant,
       numPax: f.value.number,
       date: dateString,
       reservationDate: f.value.date,
       hour: `${f.value.time}:00`,
       city: this.reservationToModify.city,
     }
      this.usServ.modifyRes(this.user!.id, resInfo, newReservation).subscribe((res)=>{
        this.confirmModify();
      })
    localStorage.removeItem('res');

  }


  confirmModify() {
    this.modalRef.close(true);
    this.reservationModify.emit();
    this.openmodal();

  }

  openmodal(){
    this.modalService.open(ModalConfirmModifyComponent)
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
