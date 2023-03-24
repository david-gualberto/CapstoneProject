import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse, Records } from 'src/app/interfaces/api-response';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  @ViewChild('containerCard') containerCard: ElementRef | any;
  @ViewChild('searchBar') searchBar!: ElementRef;

  constructor(private resServ: RestaurantService, private router:Router) {}
  // variabili per progress bar
  progress: number = 0;
  isLoading:boolean = true;

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
    //this.roma();
  }

  loadData() {
    let timer = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 10;
      } else {
        this.isLoading = false;
        clearInterval(timer);
      }
    }, 200);
  }

  //  chiamata per i ristoranti roma
  roma() {
    this.resServ.getRestaurantRome().subscribe((res) => {
      this.api = res;
      this.record = this.api.data;
      for(let i = 0; i<11; i++) {
          this.listRestaurant.push(this.record.data[i])
      }
      //this.listRestaurant = this.record.data;
      console.log(this.listRestaurant)
    });
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

  //search
  search(value:string){
    this.router.navigate(['/search'], { queryParams: { q: value } });
  }

}
