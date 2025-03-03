import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { MatTableModule } from '@angular/material/table';

export interface commissionsData {
  collection: number;
  collectionRate: number;
  numberCredits: number;
  totalAmount: number;
}

const COMMISSIONS_DATA: commissionsData[] = [
  {collection: 120, collectionRate: 1.0079, numberCredits: 10, totalAmount: 300},
];

/**
 * @title Styling columns using their auto-generated column names
 */

@Component({
  selector: 'app-commissions',
  imports: [SearchBarZoneComponent, MatTableModule],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.css'
})
export class CommissionsComponent {
  commissionsCol: string[] = ['collection', 'collectionRate', 'numberCredits', 'totalAmount'];
  dataCommissions = COMMISSIONS_DATA;
}
