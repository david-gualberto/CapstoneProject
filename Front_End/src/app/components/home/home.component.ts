import { JsonPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ApiResponse, Records } from 'src/app/interfaces/api-response';
import { JwtResponse, User } from 'src/app/interfaces/jwt-response';
import { Register } from 'src/app/interfaces/register';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('containerCard') containerCard: ElementRef | any;
  @ViewChild('searchBar') searchBar!: ElementRef;

  constructor(
    private resServ: RestaurantService,
    private router: Router,
    private usServ: UserService
  ) { }
  //Variabile per progressbar
  isLoading = true;
  progress: number = 0;
  //variabili per dati utente
  user!: User | undefined;

  //variabili per chiamata ristoranti
  api!: ApiResponse;
  record!: Records;
  listRestaurant: Restaurant[] = [];

  //variabili per scroll
  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  ngOnInit(): void {
    this.loadData();
    if (localStorage.getItem('user')) {
      const userObj = JSON.parse(localStorage.getItem('user') ?? '');
      this.user = userObj;
      this.usServ.getUser(this.user!.id).subscribe((res) => {
        this.user = res;
        this.getRestaurant(this.user!.city);
      });
    }
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

  //  chiamata per i ristoranti in base alla città dell'utente loggato
  getRestaurant(city: string) {
    this.resServ.getRestaurantByCity(city).subscribe((res) => {
      this.api = res;
      this.record = this.api.data;
      for (let i = 0; i < 11; i++) {
        if (this.record.data[i].currentOpenStatusText.includes('Opens in')) {
          this.record.data[i].currentOpenStatusText = 'Aprirà a breve';
        } else if (this.record.data[i].currentOpenStatusText.includes('Open')) {
          this.record.data[i].currentOpenStatusText = 'Aperto';
        } else if (
          this.record.data[i].currentOpenStatusText.includes('Closed')
        ) {
          this.record.data[i].currentOpenStatusText = 'Chiuso';
        }
        this.transalteCusine(
          this.record.data[i].establishmentTypeAndCuisineTags[0],
          i
        );
        this.listRestaurant.push(this.record.data[i]);
      }
    });
    console.log(this.listRestaurant);
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

  //filtraggio in base al tipo di ristorante
  getRestaurantbyTipe(event: any) {
    const value = event.target.dataset.value;
    localStorage.setItem('tipo', value);
    this.router.navigate(['search']);
  }

  transalteCusine(type: string, i: number) {
    switch (type) {
      case 'Seafood':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Di mare';
        break;
      case 'Italian':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Italiana';
        break;
      case 'American':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Americana';
        break;
      case 'Dining bars':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Bistrot';
        break;
      case 'Northern-Italian':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Nord Italia';
        break;
      case 'Filipino':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Asiatico';
        break;
      case 'Japanese':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Giapponese';
        break;
      case 'Middle Eastern':
        this.record.data[i].establishmentTypeAndCuisineTags[0] =
          'Mediorientale';
        break;
      case 'Iternational':
        this.record.data[i].establishmentTypeAndCuisineTags[0] =
          'Internazionale';
        break;
      case 'Indian':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Indiana';
        break;
      case 'Tuscan':
        this.record.data[i].establishmentTypeAndCuisineTags[0] =
          'Cucina Toscana';
        break;
      case 'Brew Pub':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Birreria';
        break;
      case 'Mediterranean':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Mediterranea';
        break;
      case 'Barbecue':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Barbecue';
        break;
      case 'Pizza':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Pizza';
        break;
      case 'Fusion':
        this.record.data[i].establishmentTypeAndCuisineTags[0] = 'Fusion';
        break;
      default:
        this.record.data[i].establishmentTypeAndCuisineTags[0] =
          'Bar Ristorante';
        break;
    }
  }
}
