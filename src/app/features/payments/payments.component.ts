import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { SaveButtonComponent } from "../../shared/componentes/save-button/save-button.component";
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";
import { MatTableModule } from '@angular/material/table';
export interface RenewCredit {
  clients: string; 
  name: string;
  loans: string;
  classification: string;
  compliance: string;
  deliveryDate: string;
  dueDate: string;
  week: string;
  weeklyAmount: string;
  latePayment: string;
  earlyPayment: string;
  lateFees: string;
  payment: string;
  paymentType: string;
}
const PAYMENT_DATA: RenewCredit[] = [
  {clients: '1', name: 'Claudia Yaneth Rafael',loans:'2', classification: 'A',compliance:'Regular', 
   deliveryDate:'28/07/2024', dueDate:'25/01/2025',week:'10',weeklyAmount: '300', latePayment: '0',
  earlyPayment: '200',lateFees:'1', payment: '500', paymentType: 'Transferencia'},
  
];
/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-payments',
  imports: [SearchBarZoneComponent, SaveButtonComponent, PrintButtonComponent, MatTableModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  PaymentCol: string[] = ['clients','name', 'loans','classification', 'compliance', 'deliveryDate', 
  'dueDate','week', 'weeklyAmount', 'latePayment','earlyPayment','lateFees', 'payment','paymentType'];
  dataPayment = PAYMENT_DATA;
}
