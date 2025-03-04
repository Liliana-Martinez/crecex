import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
export interface RenewCredit { 
  name: string;
  address: string;
  phone: string;
  classification: string;
  loans: string;
  date: string;
  week: string;
  weeklyAmount: string;
  compliance: string;
}
const RENEW_CREDIT_DATA: RenewCredit[] = [
  {name: 'Claudia Yaneth Rafael', address: 'Avila Camacho #22', phone: '3418780498', classification: 'A', 
    loans:'2',date:'25 Enero',week:'10',weeklyAmount: '200', compliance:'Regular'}, 
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-table',
  imports: [MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  RenewCreditCol: string[] = ['name', 'address', 'phone', 'classification', 'loans', 'date', 'week', 'weeklyAmount', 'compliance'];
  dataRenewCredit = RENEW_CREDIT_DATA;
}
