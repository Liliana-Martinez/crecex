import { Component } from '@angular/core';
import { SubmenuStatisticsComponent } from '../../components/submenu-statistics/submenu-statistics.component';
import { SearchBarZoneComponent } from '../../../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { MatTableModule } from '@angular/material/table';

export interface CreditsReport {
  creditNumber: number;
  creditAmount: number;
  date: Date;
  weeklyAmount: number; 
}

const CREDITS_DATA: CreditsReport[] = [
  {creditNumber: 23, creditAmount: 2500, date: new Date("2025-03-01"), weeklyAmount: 520},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-total-payments',
  imports: [SubmenuStatisticsComponent, SearchBarZoneComponent, MatTableModule],
  templateUrl: './total-payments.component.html',
  styleUrl: './total-payments.component.css'
})
export class TotalPaymentsComponent {
  totalCreditsCol: string[] = ['creditNumber', 'creditAmount', 'date', 'weeklyAmount'];
  dataTotalCredits = CREDITS_DATA;
}
