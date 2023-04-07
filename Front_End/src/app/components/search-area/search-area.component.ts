import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss']
})
export class SearchAreaComponent {

  constructor(private router: Router) {}

  @Output() searchEvent = new EventEmitter<string>();

  search(value: string, searchBar: HTMLInputElement) {
    this.router.navigate(['search'], { queryParams: { q: value } });
    this.searchEvent.emit(value);
    searchBar.value = ''; // Imposta il valore del campo di input su una stringa vuota
  }
}
