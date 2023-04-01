import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('containerCard') containerCard: ElementRef | any;
  //variabili per scroll
  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  //Variabile per progressbar
  isLoading = true;
  progress: number = 0;

  //variabile per ricerca attiva
  searchStatus: boolean = false;
  resultMessage: string = '';
  homeStatus: boolean = false;

  //variabili per chiamata api
  api!: ApiResponse;
  record!: Records;
  user!: JwtResponse;

  //variabili per lista ristoranti e ristorante singolo
  tipo!: string | undefined;
  restaurantName!: string | null;
  listRestaurant: Restaurant[] = [];
  typeRestaurant: Restaurant[] = [];

  constructor(
    private route: ActivatedRoute,
    private resServ: RestaurantService
  ) {}

  ngOnInit(): void {
    // this.loadData();
    // if (localStorage.getItem('user')) {
    //   const userObj = JSON.parse(localStorage.getItem('user') ?? '');
    //   this.user = userObj;
    // }
    // if (localStorage.getItem('tipo')) {
    //   this.tipo = localStorage.getItem('tipo')?.toString();
    //   if (this.tipo) {
    //     this.homeStatus = true;
    //     this.getRestaurantByType(this.user.city, this.tipo);
    //   }
    // } else {
    //   if (this.route.snapshot.queryParamMap.get('q')) {
    //     this.homeStatus = true;
    //     this.restaurantName = this.route.snapshot.queryParamMap.get('q');
    //     this.search(this.restaurantName!);
    //   } else {
    //     this.searchStatus = false;
    //   }
    // }
  }

  //Ricerca del ristorante per tipologia cucina
  getRestaurantByType(city: string, tipo: string) {
    this.searchStatus = true;
    this.resServ.getRestaurantByCity(city).subscribe((res) => {
      this.api = res;
      this.record = this.api.data;
      this.listRestaurant = this.record.data;
      this.listRestaurant.forEach((restaurant) => {
        if (
          restaurant.establishmentTypeAndCuisineTags[0] == tipo ||
          restaurant.establishmentTypeAndCuisineTags[1] == tipo
        ) {
          this.typeRestaurant.push(restaurant);
        }
      });
    });
    localStorage.removeItem('tipo');
  }

  //Ricerca del ristorante per nome completo o parziale
  search(x: string) {
    const searchStr = x.toLowerCase();
    this.resServ.getRestaurantByCity(this.user.city).subscribe((res) => {
      this.api = res;
      this.record = this.api.data;
      this.listRestaurant = this.record.data;
      this.listRestaurant.forEach((restaurant) => {
        const nameStr = restaurant.name.toLowerCase();
        if (nameStr.includes(searchStr)) {
          this.typeRestaurant.push(restaurant);
        }
      });
      if (this.typeRestaurant.length > 0) {
        this.searchStatus = true;
        this.homeStatus = true;
      } else {
        this.searchStatus = false;
        this.homeStatus = true;
        this.resultMessage = `Il ristorante "${searchStr}" non è stato trovato`;
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

  // scroll-x tramite i bottoni
  left() {
    this.containerCard.nativeElement.scrollLeft -= 250;
    this.isDragging = false;
  }
  right() {
    this.containerCard.nativeElement.scrollLeft += 250;
    this.isDragging = false;
  }

  //drag del mouse per scroll-x delle card
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX - this.containerCard.nativeElement.offsetLeft;
    this.scrollLeft = this.containerCard.nativeElement.scrollLeft;
  }
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.clientX - this.containerCard.nativeElement.offsetLeft;
    const distance = (x - this.startX) * 1.5;
    this.containerCard.nativeElement.scrollLeft = this.scrollLeft - distance;
  }
  onMouseUp() {
    this.isDragging = false;
  }

  searchBar(value: string) {
    this.resultMessage = "";
    this.searchStatus = false;
    this.typeRestaurant = [];
    this.search(value);
  }
}
