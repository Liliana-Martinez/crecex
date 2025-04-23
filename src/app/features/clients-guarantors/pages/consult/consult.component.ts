import { Component } from '@angular/core';
import { SubmenuComponent } from '../../components/submenu/submenu.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { MatTableModule } from '@angular/material/table'

export interface CurrentCredit {
  name: string;
  creditNumber: number;
  amount: number;
  date: Date;
  numberWeeks: number;
  weeklyAmount: number;
  paymentWeek: number;
  paymentStatus: string;
  //creditNumHistory: string;
}

export interface CreditHistory {
  creditNumHistory: number;
  amountHistory: number;
  dateHistory: Date;
  numWeeksHistory: number;
  statusHistory: string;
}

const CURRENT_CREDIT: CurrentCredit[] = [
  {creditNumber: 1, name: 'Laura Gonzalez', amount: 2500, date: new Date("2025-01-15"), numberWeeks: 11, weeklyAmount: 150, paymentWeek: 5, paymentStatus: 'Excelente'},
  {creditNumber: 2, name: 'Julio Chavez', amount: 5000, date: new Date("2025-01-15"), numberWeeks: 10, weeklyAmount: 250, paymentWeek: 4, paymentStatus: 'Bueno'},
];

const CREDIT_HISTORY: CreditHistory[] = [
  {creditNumHistory: 1, amountHistory: 6000, dateHistory: new Date("2025-01-15"), numWeeksHistory: 16, statusHistory: 'Excelente'},
  {creditNumHistory: 2, amountHistory: 4500, dateHistory: new Date("2025-01-15"), numWeeksHistory: 12, statusHistory: 'Bueno'},
  {creditNumHistory: 3, amountHistory: 3000, dateHistory: new Date("2025-01-15"), numWeeksHistory: 16, statusHistory: 'Regular'},
  {creditNumHistory: 4, amountHistory: 2500, dateHistory: new Date("2025-01-15"), numWeeksHistory: 16, statusHistory: 'Malo'},
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
  modulo: string = 'consult';
  //currentCreditColumns
  currentCreditCol: string[] = ['creditNumber', 'name', 'amount', 'numberWeeks', 'date', 'weeklyAmount', 'paymentWeek', 'paymentStatus'];
  creditHistoryCol: string[] = ['creditNumHistory', 'amountHistory', 'dateHistory', 'numWeeksHistory', 'statusHistory'];
  
  dataCurrentCredit = CURRENT_CREDIT;
  dataCreditHistory = CREDIT_HISTORY;
}
