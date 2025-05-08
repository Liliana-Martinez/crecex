import { Component } from '@angular/core';
import { SubmenuComponent } from '../../components/submenu/submenu.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'

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
  dataCreditHistory = new MatTableDataSource<any>();
  currentCreditCol: string[] = ['creditNumber', 'name', 'amount', 'numberWeeks', 'date', 'weeklyAmount', 'paymentWeek', 'paymentStatus'];
  creditHistoryCol: string[] = ['creditNumHistory', 'amountHistory', 'dateHistory', 'numWeeksHistory', 'statusHistory'];

  //Método para escuchar el nombre emitido
  onClienteEncontrado(response: any): void {
    if (response.message === 'Cliente no encontrado') {
      this.client = null;
      this.currentCredit = null;
      this.creditHistory = [];
      return;
    }

    console.log('Se encontro el cliente', response.client);
    const historyResponse = response.creditHistory;
    console.log(historyResponse);
  }
  
}
