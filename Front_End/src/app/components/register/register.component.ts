import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { Register } from 'src/app/interfaces/register';
import { AuthService } from 'src/app/services/auth.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalComponent } from '../modal-confirm-register/modal.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  //variabili per mostrare o nascondere la password
  showPassword: boolean = false;
  passwordFieldType: string = 'password';

  //variabile per errore
  err:string|undefined;

  //for e dati del form
  f!:FormGroup;
  n:number = 0;
  numParse:string = '';

  //modale
  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(private authSrv:AuthService, private r:Router, private modalService: MdbModalService) { }

  ngOnInit(): void {
    this.f = new FormGroup({
      name: new FormControl("", Validators.required),
      surname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]),
      city: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      postCode: new FormControl('', Validators.required),
    })
  }

  register(f:FormGroup) {
    this.n = f.value.postCode;
    this.numParse = this.n.toString();
    if (this.numParse.length == 4 || this.numParse.length == 3) {
      this.numParse = this.numParse.padStart(5, '0')
    }
    let user: Register = {
     name: f.value.name,
     surname: f.value.surname,
      email: f.value.email,
      username: f.value.username,
      password: f.value.password,
      city: f.value.city,
      street: f.value.street,
      number: f.value.number,
      postCode: this.numParse
     }
    this.authSrv.register(user).pipe(catchError(err=>{
      this.err = err.error.message
      if (err.status == 200) {
        this.openModal()
        this.r.navigate(["login"])
      }
      throw err
    })).subscribe(res=> {
      console.log(res);
    })
    console.log(user)
  }

  mostraNascondiPassword(): void {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalComponent)
  }

}
