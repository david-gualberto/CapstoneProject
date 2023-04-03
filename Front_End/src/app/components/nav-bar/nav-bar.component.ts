import { Component, OnInit } from '@angular/core';
import { JwtResponse, UserProfile } from 'src/app/interfaces/jwt-response';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  user!:UserProfile| undefined;

  constructor(private authSrv:AuthService, private r:Router, private usServ:UserService) { }

  ngOnInit(): void {
    if(localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? "");
      this.user = userObj;
      this.usServ.getUser(this.user!.id).subscribe((res)=>{
        this.user = res;
        console.log(this.user)
      })
    }
  }

  logout(){
    this.authSrv.logout();
  }
}
