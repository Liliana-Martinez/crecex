import { Component } from '@angular/core';
import { SubmenuComponent } from '../../components/submenu/submenu.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar/search-bar.component';
import { MatTableModule } from '@angular/material/table'

export interface PeriodicElement {
  name: string;
  creditNumber: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {creditNumber: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {creditNumber: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {creditNumber: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {creditNumber: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {creditNumber: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {creditNumber: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {creditNumber: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {creditNumber: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {creditNumber: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {creditNumber: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-consult',
  imports: [SubmenuComponent, SearchBarComponent, MatTableModule],
  templateUrl: './consult.component.html',
  styleUrl: './consult.component.css'
})
export class ConsultComponent {
  displayedColumns: string[] = ['creditNumber', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
