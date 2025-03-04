import { Component } from '@angular/core';
import { SubmenuComponent } from '../../components/submenu/submenu.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { MatTableModule } from '@angular/material/table'

export interface CurrentCredit {
  name: string;
  creditNumber: number;
  amount: number;
  date: Date;
  weekNumber: number;
  weeklyAmount: number;
  paymentStatus: string;
  //creditNumHistory: string;
}

export interface CreditHistory {
  creditNumHistory: number;
  amountHistory: number;
  dateHistory: Date;
  statusHistory: string;
}

const CURRENT_CREDIT: CurrentCredit[] = [
  {creditNumber: 1, name: 'Hydrogen', amount: 1.0079, date: new Date("2025-01-15"), weekNumber: 11, weeklyAmount: 150, paymentStatus: 'Excelente'},
  {creditNumber: 2, name: 'Helium', amount: 4.0026, date: new Date("2025-01-15"), weekNumber: 10, weeklyAmount: 250, paymentStatus: 'Bueno'},
];

const CREDIT_HISTORY: CreditHistory[] = [
  {creditNumHistory: 1, amountHistory: 1.0079, dateHistory: new Date("2025-01-15"), statusHistory: 'Excelente'},
  {creditNumHistory: 2, amountHistory: 4.0026, dateHistory: new Date("2025-01-15"), statusHistory: 'Bueno'},
  {creditNumHistory: 3, amountHistory: 6.941, dateHistory: new Date("2025-01-15"), statusHistory: 'Regular'},
  {creditNumHistory: 4, amountHistory: 9.0122, dateHistory: new Date("2025-01-15"), statusHistory: 'Malo'},
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
  //currentCreditColumns
  currentCreditCol: string[] = ['creditNumber', 'name', 'amount', 'date', 'weekNumber', 'weeklyAmount', 'paymentStatus'];
  creditHistoryCol: string[] = ['creditNumHistory', 'amountHistory', 'dateHistory', 'statusHistory'];
  
  dataCurrentCredit = CURRENT_CREDIT;
  dataCreditHistory = CREDIT_HISTORY;
}
