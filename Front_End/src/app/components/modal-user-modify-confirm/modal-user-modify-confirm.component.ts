import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-user-modify-confirm',
  templateUrl: './modal-user-modify-confirm.component.html',
  styleUrls: ['./modal-user-modify-confirm.component.scss'],
})
export class ModalUserModifyConfirmComponent {
  constructor(
    public modalRef: MdbModalRef<ModalUserModifyConfirmComponent>,
    private r: Router
  ) {}

  close() {
    location.reload();
    this.modalRef.close();
  }
}
