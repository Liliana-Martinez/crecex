import { Component, Input } from '@angular/core';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../componentss/table/table.component';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
import { PrintComponent } from '../../componentss/print/print.component';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  standalone: true,
  imports: [
    SearchBarComponent,
    FormCreditComponent,
    PrintButtonComponent,
    CommonModule,
    MatTableModule,
    TableComponent,
    PrintComponent
  ]
})
export class NewComponent {

  @Input() response: any = null;

  modulo: string = 'new';
  cliente: ClienteConDatos | null = null;
  datosParaImprimir: any;
  errorMessage: string = '';
  mostrarImpresion = false;

  clienteEncontrado(cliente: ClienteConDatos) {
    this.cliente = cliente;
  }

  guardarDatosParaImprimir(datos: any) {
    this.datosParaImprimir = datos;
  }

  imprimir() {

    if (!this.datosParaImprimir) {
      console.warn('No hay datos para imprimir');
      return;
    }

    this.mostrarImpresion = false;

    setTimeout(() => {
      this.mostrarImpresion = true;

      setTimeout(() => {
        this.cliente = null;
        this.datosParaImprimir = null;
        this.mostrarImpresion = false;
      }, 500);

    }, 300);
  }
}
 