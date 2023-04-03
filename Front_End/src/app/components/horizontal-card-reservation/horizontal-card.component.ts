import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { JwtResponse } from 'src/app/interfaces/jwt-response';
import { Reservation } from 'src/app/interfaces/reservation';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserService } from 'src/app/services/user.service';
import { ModalConfirmDeleteResComponent } from '../modal-confirm-delete-res/modal-confirm-delete-res.component';
import { ModalModifyResComponent } from '../modal-modify-res/modal-modify-res.component';
import { ModalConfirmModifyComponent } from '../modal-confirm-modify/modal-confirm-modify.component';

@Component({
  selector: 'app-horizontal-card',
  templateUrl: './horizontal-card.component.html',
  styleUrls: ['./horizontal-card.component.scss'],
})
export class HorizontalCardComponent implements OnInit {
  @Input('reservation')
  reservation!: Reservation;
  new_hour: string = '';
  //variabili per dati utente
  user!: JwtResponse | undefined;
  //modale
  modalRef: MdbModalRef<ModalConfirmDeleteResComponent> | null = null;
  @Output() reservationDeleted = new EventEmitter<void>();
  @Output() reservationModify = new EventEmitter<void>();

  constructor(
    private resSrv: RestaurantService,
    private usSrv: UserService,
    private r: Router,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {

    if (localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? '');
      this.user = userObj;
    }
    this.new_hour = this.reservation.hour.slice(0, -3);
  }

  remove() {
    this.modalRef = this.modalService.open(ModalConfirmDeleteResComponent);
    this.modalRef.onClose.subscribe((result) => {
      if (result) {
        this.usSrv
          .removeReservation(this.user!.id, this.reservation)
          .subscribe((res) => {
            this.reservationDeleted.emit();
          });
      }
    });
  }
  modify(){

    localStorage.setItem('res', JSON.stringify(this.reservation))
    this.modalRef = this.modalService.open(ModalModifyResComponent);
    this.modalRef.onClose.subscribe((result)=>{
      if(result) {
        this.reservationModify.emit();
      }
    })
  }

}
