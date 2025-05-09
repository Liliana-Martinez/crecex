import { Component } from '@angular/core';
import { SubmenuComponent } from '../../components/submenu/submenu.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { CreditHistory } from '../../../../models/credit-history';
import dayjs from 'dayjs';
import { CurrentCredit } from '../../../../models/current-credit';


@Component({
  selector: 'app-consult',
  imports: [SubmenuComponent, SearchBarComponent, MatTableModule],
  templateUrl: './consult.component.html',
  styleUrl: './consult.component.css'
})
export class ConsultComponent {
  modulo: string = 'consult';
  client: any = null;
  currentCredit: any = null;
  creditHistory: any = null;
  dataCurrentCredit = new MatTableDataSource<any>();
  dataCreditHistory = new MatTableDataSource<CreditHistory>();
  currentCreditCol: string[] = ['creditNum', 'name', 'amount', 'weeks', 'date', 'weeklyAmount', 'paymentWeek', 'status'];
  creditHistoryCol: string[] = ['creditNumHistory', 'amountHistory', 'dateHistory', 'numWeeksHistory', 'statusHistory'];

  //Método para escuchar el nombre emitido
  onClienteEncontrado(response: any): void {
    if (response.message === 'Cliente no encontrado') {
      this.client = null;
      this.currentCredit = null;
      this.creditHistory = [];
      this.dataCurrentCredit.data = [];
      this.dataCreditHistory.data = [];
      return;
    }

    this.client = response.client;
    this.currentCredit = response.currentCredit;
    this.creditHistory = response.creditHistory;

    //Armar el objeto para la tabla "Credito Actual"
    if (this.currentCredit) {
      const currentCreditRows: CurrentCredit = {
        creditNum: 1,
        name: this.client.nombreCompleto,
        amount: this.currentCredit.monto,
        weeks: this.currentCredit.semanas,
        date: dayjs(this.currentCredit.fechaEntrega).format('DD/MM/YYYY'),
        weeklyAmount: this.currentCredit.abonoSemanal,
        paymentWeek: this.currentCredit.numeroSemana,
        status: this.currentCredit.cumplimiento
      };
      this.dataCurrentCredit.data = [currentCreditRows];
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
}
