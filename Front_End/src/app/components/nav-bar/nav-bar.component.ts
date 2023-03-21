import { Component, OnInit } from '@angular/core';
import { JwtResponse } from 'src/app/interfaces/jwt-response';
import jwtDecode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  //variabile booleana per la visuale di loggato e non loggato
  loggato:boolean = false;
  user:JwtResponse| undefined;
  constructor(private authSrv:AuthService) { }

  ngOnInit(): void {
    if(localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? "");
      const token = userObj.token;
      const decodedToken = jwtDecode<any>(token);
      if (decodedToken.exp < Date.now() / 1000) {
        this.loggato = false;
        localStorage.removeItem('user')
      } else {
        this.loggato = true;
        this.user = userObj;
      }
    }
  }

  logout(){
    this.authSrv.logout();
    this.loggato = false;
  }
}
