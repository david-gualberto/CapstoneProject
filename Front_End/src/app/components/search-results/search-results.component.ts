import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { ApiResponse, Records } from 'src/app/interfaces/api-response';
import { JwtResponse, UserProfile } from 'src/app/interfaces/jwt-response';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { CityServiceService } from 'src/app/services/city-service.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserService } from 'src/app/services/user.service';

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
  user!:UserProfile| undefined;

  //variabili per lista ristoranti e ristorante singolo
  tipo!: string | undefined;
  cityTitle: boolean = false;
  city!:string | null;
  restaurantName!: string | null;
  singleRestaurant!:Restaurant;
  listRestaurant: Restaurant[] = [];
  typeRestaurant: Restaurant[] = [];

  constructor(
    private route: ActivatedRoute,
    private resServ: RestaurantService,
    private usServ:UserService,
    private cityService: CityServiceService
  ) {}

  ngOnInit(): void {
    this.city = this.cityService.getCity();
    this.typeRestaurant = [];
    this.loadData();
    if (localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? '');
      this.user = userObj;
      this.usServ.getUser(this.user!.id).subscribe((res)=>{
        this.user = res;
      })
      if (localStorage.getItem('tipo')) {
        this.tipo = localStorage.getItem('tipo')?.toString();
        if (this.tipo) {
          this.homeStatus = true;
          this.getRestaurantByType(this.user!.city, this.tipo);
        }
      } else {
        if (this.city) {
          this.cityTitle = true;
          this.homeStatus = true;
          this.getRestaurant(this.city);
        } else if (this.route.snapshot.queryParamMap.get('q')) {
          this.cityTitle = false;
          this.homeStatus = true;
          this.restaurantName = this.route.snapshot.queryParamMap.get('q');
          this.search(this.restaurantName!);
        } else {
          this.searchStatus = false;
        }
      }
    }
  }


 //Ricerca del ristorante per città
  getRestaurant(city: string) {
    this.searchStatus = true;
    this.resServ.getRestaurantByCity(city).subscribe((res) => {
      this.api = res;
      this.record = this.api.data;
      for (let i = 0; i < 20; i++) {
      this.singleRestaurant = this.record.data[i];
      if (this.singleRestaurant.currentOpenStatusText.includes("Opens in")) {
        this.singleRestaurant.currentOpenStatusText = "Aprirà a breve"
      } else if (this.singleRestaurant.currentOpenStatusText.includes("Open")) {
        this.singleRestaurant.currentOpenStatusText = "Aperto"
      } else if (this.singleRestaurant.currentOpenStatusText.includes("Closed")) {
        this.singleRestaurant.currentOpenStatusText = "Chiuso"
      }
        this.transalteCusine(this.singleRestaurant.establishmentTypeAndCuisineTags[0])
        this.typeRestaurant.push(this.singleRestaurant);
      }
    });
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
          this.singleRestaurant = restaurant;
          this.transalteCusine(this.singleRestaurant.establishmentTypeAndCuisineTags[0])
          if (this.singleRestaurant.currentOpenStatusText.includes("Opens in")) {
            this.singleRestaurant.currentOpenStatusText = "Aprirà a breve"
          } else if (this.singleRestaurant.currentOpenStatusText.includes("Open")) {
            this.singleRestaurant.currentOpenStatusText = "Aperto"
          } else if (this.singleRestaurant.currentOpenStatusText.includes("Closed")) {
            this.singleRestaurant.currentOpenStatusText = "Chiuso"
          }
          this.typeRestaurant.push(this.singleRestaurant);
        }
      });
      if(this.typeRestaurant.length < 1) {
        this.searchStatus = false;
        this.resultMessage = `Non ci sono ristoranti disponibili in questa categoria`;
      }
    });
    localStorage.removeItem('tipo');
  }

  //Ricerca del ristorante per nome completo o parziale
  search(x: string) {
    this.cityTitle = false;
    const searchStr = x.toLowerCase();
    let obs: Observable<any>[] = [];
    if (this.city != null) {
      obs.push(this.resServ.getRestaurantByCity(this.city));
    }
    if (this.user?.city != null && this.user.city !== this.city) {
      obs.push(this.resServ.getRestaurantByCity(this.user.city));
    }
    forkJoin(obs).subscribe((results) => {
      this.typeRestaurant = [];
      results.forEach((res) => {
        const restaurants = res.data.data;
        restaurants.forEach((restaurant:any) => {
          const nameStr = restaurant.name.toLowerCase();
          if (nameStr.indexOf(searchStr) !== -1) {
            this.singleRestaurant = restaurant;
            if (this.singleRestaurant.currentOpenStatusText.includes("Opens in")) {
              this.singleRestaurant.currentOpenStatusText = "Aprirà a breve"
            } else if (this.singleRestaurant.currentOpenStatusText.includes("Open")) {
              this.singleRestaurant.currentOpenStatusText = "Aperto"
            } else if (this.singleRestaurant.currentOpenStatusText.includes("Closed")) {
              this.singleRestaurant.currentOpenStatusText = "Chiuso"
            }
            this.transalteCusine(this.singleRestaurant.establishmentTypeAndCuisineTags[0])
            this.typeRestaurant.push(restaurant);
          }
        });
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

  transalteCusine(type:string){
    switch(type) {
      case 'Seafood':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Di mare';
      break;
      case 'Italian':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Italiana';
      break;
      case 'American':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Americana';
      break;
      case 'Dining bars':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Bistrot';
      break;
      case 'Northern-Italian':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Nord Italia';
      break;
      case 'Filipino':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Asiatico';
      break;
      case 'Japanese':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Giapponese';
      break;
      case 'Middle Eastern':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Mediorientale';
      break;
      case 'Iternational':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Internazionale';
      break;
      case 'Indian':
        this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Indiana';
      break;
        case 'Tuscan':
          this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Cucina Toscana';
        break;
        case 'Brew Pub':
          this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Birreria';
        break;
        case 'Mediterranean':
          this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Mediterranea';
        break;
        case 'Barbecue':
          this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Barbecue';
        break;
        case 'Pizza':
          this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Pizza';
        break;
        case 'Fusion':
          this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Fusion';
        break;
        default:
          this.singleRestaurant.establishmentTypeAndCuisineTags[0] = 'Bar Ristorante';
          break

  }
}
}
