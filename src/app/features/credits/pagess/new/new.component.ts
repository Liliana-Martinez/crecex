import { Component, OnInit } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../componentss/table/table.component';


export interface NewCredit {
  name: string;
  address: string;
  phone: string;
  classification: string;
}

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  standalone: true,
  imports: [
    SubmenuuComponent,
    SearchBarComponent,
    FormCreditComponent,
    SaveButtonComponent,
    PrintButtonComponent,
    CommonModule,
    MatTableModule, 
    TableComponent
  ]
})
export class NewComponent {
  newCreditCol: string[] = ['name', 'address', 'phone', 'classification'];
  dataNewCredit: NewCredit[] = [];
  notFoundMessage = '';
  modulo: string = 'new';
  cliente: any = null;

  mostrarClienteEnTabla(cliente: any) {
   this.cliente = cliente;
}
}

