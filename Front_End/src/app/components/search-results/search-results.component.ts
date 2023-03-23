import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse, Records } from 'src/app/interfaces/api-response';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  restaurantName!: string | null;
  api!: ApiResponse;
  record!: Records;
  listRestaurant!: Restaurant[];
  singleRestaurant!: Restaurant;
  constructor(private route: ActivatedRoute, private resServ: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantName = this.route.snapshot.queryParamMap.get('q');
    const searchUppercase = this.restaurantName?.charAt(0).toUpperCase() + this.restaurantName!.slice(1);
    //this.search(searchUppercase)
  }


  //Ricerca del ristorante per nome
  search(x:string){
    this.resServ.getRestaurantRome().subscribe((res) => {
      this.api = res;
      this.record = this.api.data;
      this.listRestaurant = this.record.data;
      this.listRestaurant.forEach(restaurant => {
        if(restaurant.name == x) {
          this.singleRestaurant = restaurant;
          console.log(restaurant)
        }
      });
    });
  }
}
