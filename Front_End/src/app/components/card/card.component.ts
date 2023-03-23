import { Component, Input, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/interfaces/restaurant';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input('restaurant')
  restaurant!: Restaurant;

  constructor() { }

  ngOnInit(): void {
  }

}
