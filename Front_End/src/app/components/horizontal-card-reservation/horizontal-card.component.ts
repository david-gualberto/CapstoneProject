import { Component, Input, OnInit } from '@angular/core';
import { ApiResponse, Records } from 'src/app/interfaces/api-response';
import { Reservation } from 'src/app/interfaces/reservation';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-horizontal-card',
  templateUrl: './horizontal-card.component.html',
  styleUrls: ['./horizontal-card.component.scss']
})
export class HorizontalCardComponent implements OnInit {
  @Input('reservation')
  reservation!: Reservation;
  new_hour:string = "";



  constructor(private resSrv:RestaurantService) { }

  ngOnInit(): void {
    this.new_hour =  this.reservation.hour.slice(0, -3);
  }


}
