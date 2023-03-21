import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Login } from 'src/app/interfaces/login';
import { AuthService } from 'src/app/services/auth.service';
import { catchError } from 'rxjs';
import { JwtResponse } from 'src/app/interfaces/jwt-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('l', { static: true }) l!: NgForm;

  //variabile per errore
  err: string | undefined;
  user: JwtResponse | undefined;

  constructor(private authSrv: AuthService, private r: Router) {}

  ngOnInit(): void {}

  login(l: NgForm) {
    let data: Login = {
      username: l.value.username,
      password: l.value.password,
    };
    this.authSrv.login(data).pipe(catchError((err) => {
          const codeErr = err.error.status;
          if (codeErr == 401) {
            this.err = 'Username o password errati';}
          throw err;
        })
      ).subscribe((res: JwtResponse) => {
        this.r.navigate(['']);
      });
  }
}
