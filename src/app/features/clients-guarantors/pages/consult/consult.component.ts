import { Component } from '@angular/core';
import { SubmenuComponent } from '../../components/submenu/submenu.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { CreditHistory } from '../../../../models/credit-history';
import dayjs from 'dayjs';
import { CurrentCredit } from '../../../../models/current-credit';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-consult',
  imports: [CommonModule, SubmenuComponent, SearchBarComponent, MatTableModule],
  templateUrl: './consult.component.html',
  styleUrl: './consult.component.css'
})
export class ConsultComponent {
  modulo: string = 'consult';
  client: any = null;
  creditNumber: number = 0;
  currentWeek: number = 0;
  currentCredit: any = null;
  creditHistory: any = null;
  dataCurrentCredit = new MatTableDataSource<any>();
  dataCreditHistory = new MatTableDataSource<CreditHistory>();
  currentCreditCol: string[] = ['creditNum', 'name', 'amount', 'weeks', 'date', 'weeklyAmount', 'paymentWeek', 'status'];
  creditHistoryCol: string[] = ['creditNumHistory', 'amountHistory', 'dateHistory', 'numWeeksHistory', 'statusHistory'];

  //Método para escuchar el nombre emitido
  onClienteEncontrado(response: any): void {
    this.client = response.client;
    this.creditNumber = response.totalCredits;
    this.currentWeek = response.currentWeek;
    this.currentCredit = response.currentCredit;
    this.creditHistory = response.creditHistory;
    
    console.log('Cliente buscado: ', this.client);
    console.log('Numero de creditos: ', this.creditNumber);
    console.log('Semana actual: ', this.currentWeek);
    console.log('Credito actual: ', this.currentCredit);
    console.log('Historial crediticio: ', this.creditHistory);

    //Armar el objeto para la tabla "Credito Actual"
    if (this.currentCredit && this.currentCredit.length > 0) {
      const currentCreditRows: CurrentCredit[] = this.currentCredit.map((credit: any, i: number) => ({
        creditNum: this.creditNumber - this.currentCredit.length + 1 + i,
        name: this.client.nombreCompleto,
        amount: credit.monto,
        weeks: credit.semanas,
        date: dayjs(credit.fechaEntrega).format('DD/MM/YYYY'),
        weeklyAmount: credit.abonoSemanal,
        paymentWeek: this.currentWeek,
        status: credit.cumplimiento
      }));
      this.dataCurrentCredit.data = currentCreditRows;
    } else {
      this.dataCurrentCredit.data = [];
    }
    
    //Armar el objeto para la tabla "Historial crediticio"
    if (this.creditHistory && this.creditHistory.length > 0) {
      const historyRows: CreditHistory[] = this.creditHistory.map((credit: any, i: number) => ({
        creditNumHistory: i + 1,
        amountHistory: credit.monto,
        dateHistory: dayjs(credit.fechaEntrega).format('DD/MM/YYYY'),
        numWeeksHistory: credit.semanas,
        statusHistory: credit.cumplimiento
      }));
      this.dataCreditHistory.data = historyRows;
    } else {
      this.dataCreditHistory.data = [];
    }
  }
  onClienteNoEncontrado(): void {
    this.client = null;
    this.creditNumber = 0;
    this.dataCurrentCredit.data = [];
    this.dataCreditHistory.data = [];
  }
}

