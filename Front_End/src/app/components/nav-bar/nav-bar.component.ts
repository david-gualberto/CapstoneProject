import { Component, OnInit } from '@angular/core';
import { JwtResponse, UserProfile } from 'src/app/interfaces/jwt-response';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CityServiceService } from 'src/app/services/city-service.service';
import { WeatherService } from 'src/app/services/weather.service';
import { WeatherAPI, city, infoWeather, weather } from 'src/app/interfaces/weather-api';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  route: ActivatedRoute = new ActivatedRoute;
  user!:UserProfile| undefined;
  current!:weather;
  condition!:infoWeather;
  iconWeather!: string;
  temp!:string


  constructor(private authSrv:AuthService, private r:Router, private usServ:UserService, private cityService: CityServiceService, private wServ:WeatherService) { }

  ngOnInit(): void {
    if(localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? "");
      this.user = userObj;
      this.usServ.getUser(this.user!.id).subscribe((res)=>{
        this.user = res;
      })
    }
    this.wServ.getWeather(this.user!.city).subscribe((res:WeatherAPI)=>{
      console.log(res)
      this.current = res.current;
      this.condition = this.current.condition;
      this.iconWeather = this.condition.icon;
      this.temp = `${this.current.temp_c}°C`
    })

  }

  logout(){
    this.authSrv.logout();
  }

  changeCity(value:string){
    console.log(value)
    this.cityService.setCity(value);
    if (this.r.url.includes('/search')) {
      this.r.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.r.navigate(['/search']);
      });
    } else {
      this.r.navigate(['/search']);
    }
  }

  home(){
    this.cityService.setCity(null)
    this.r.navigate(['/home'])
  }

}
