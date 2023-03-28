import { Component, OnInit } from '@angular/core';
import { JwtResponse } from 'src/app/interfaces/jwt-response';
import jwtDecode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  user!:JwtResponse| undefined;

  constructor(private authSrv:AuthService, private r:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? "");
      this.user = userObj;
    }
  }

  logout(){
    this.authSrv.logout();
  }
}
