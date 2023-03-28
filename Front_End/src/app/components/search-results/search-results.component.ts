import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse, Records } from 'src/app/interfaces/api-response';
import { JwtResponse } from 'src/app/interfaces/jwt-response';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {

    //Variabile per progressbar
    isLoading = true;
    progress: number = 0;

  //variabile per ricerca attiva
  searchStatus: boolean = false;
  resultMessage: string = '';

  //variabili per chiamata api
  api!: ApiResponse;
  record!: Records;
  user!: JwtResponse;

  //variabili per lista ristoranti e ristorante singolo
  tipo!: string | undefined;
  restaurantName!: string | null;
  listRestaurant: Restaurant[] = [];
  typeRestaurant: Restaurant[] = [];
  singleRestaurant!: Restaurant;
  constructor(
    private route: ActivatedRoute,
    private resServ: RestaurantService
  ) {}

  ngOnInit(): void {
    this.loadData();
    if (localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? '');
      this.user = userObj;
    }
    if (localStorage.getItem('tipo')) {
      this.tipo = localStorage.getItem('tipo')?.toString();
      if (this.tipo) {
        this.getRestaurantByType(this.user.city, this.tipo);
      }
    } else {
      if (this.route.snapshot.queryParamMap.get('q')) {
        this.restaurantName = this.route.snapshot.queryParamMap.get('q');
        this.search(this.restaurantName!);
      } else {
        this.searchStatus = false;
      }
    }
  }
  //Ricerca del ristorante per tipologia cucina
  getRestaurantByType(city: string, tipo: string) {
    this.searchStatus = true;
    this.resServ.getRestaurantByCity(city).subscribe((res) => {
      this.api = res;
      this.record = this.api.data;
      this.listRestaurant = this.record.data;
      if (this.listRestaurant?.length ?? 0 === 0) {
        this.resultMessage = 'Ristorante non trovato';
      } else {
        this.listRestaurant.forEach((restaurant) => {
          if ( restaurant.establishmentTypeAndCuisineTags[0] == tipo || restaurant.establishmentTypeAndCuisineTags[1] == tipo) {
            this.typeRestaurant.push(restaurant);
          }
        });
      }
    });
    localStorage.removeItem('tipo');
  }

  //Ricerca del ristorante per nome completo o parziale
  search(x: string) {
    this.searchStatus = true;
    const searchStr = x.toLowerCase();
    this.resServ.getRestaurantByCity(this.user.city).subscribe((res) => {
      this.api = res;
      this.record = this.api.data;
      this.listRestaurant = this.record.data;
      if (this.listRestaurant?.length ?? 0 === 0) {
        this.resultMessage = `Il Ristorante "${x}" non è stato trovato`;
      } else {
        this.listRestaurant.forEach((restaurant) => {
          const nameStr = restaurant.name.toLowerCase();
          if (nameStr.includes(searchStr)) {
            this.singleRestaurant = restaurant;
            console.log(restaurant);
          }
        });
      }
    });
  }

  loadData() {
    // simula il caricamento dei dati
    let timer = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 10;
      } else {
        this.isLoading = false;
        clearInterval(timer);
      }
    }, 200);
  }
}
