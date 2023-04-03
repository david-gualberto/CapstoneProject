import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-modal-confirm-delete-res',
  templateUrl: './modal-confirm-delete-res.component.html',
  styleUrls: ['./modal-confirm-delete-res.component.scss']
})
export class ModalConfirmDeleteResComponent {
  @Output() reservationDeleted = new EventEmitter<void>();
  constructor(public modalRef: MdbModalRef<ModalConfirmDeleteResComponent>, private router:Router) {}


  confirmDelete() {
    this.modalRef.close(true);
    this.reservationDeleted.emit();
  }
}
