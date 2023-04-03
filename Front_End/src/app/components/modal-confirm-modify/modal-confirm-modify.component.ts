import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal-confirm-modify',
  templateUrl: './modal-confirm-modify.component.html',
  styleUrls: ['./modal-confirm-modify.component.scss']
})
export class ModalConfirmModifyComponent {
  constructor(public modalRef: MdbModalRef<ModalConfirmModifyComponent>) {}

}
