import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-confirm-reservation',
  templateUrl: './modal-confirm-reservation.component.html',
  styleUrls: ['./modal-confirm-reservation.component.scss']
})
export class ModalConfirmReservationComponent {
  constructor(public modalRef: MdbModalRef<ModalConfirmReservationComponent>) {}
}
