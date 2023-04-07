import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Favorite } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-horizontal-card-favorite',
  templateUrl: './horizontal-card-favorite.component.html',
  styleUrls: ['./horizontal-card-favorite.component.scss']
})
export class HorizontalCardFavoriteComponent {
  @Input('favorite')

  favorite!: Favorite;

  constructor(private resSrv:RestaurantService, private r:Router) { }

  detailRes(){
    this.r.navigate(['details'], { queryParams: { id: this.favorite.idrestaurant } });
  }
}
