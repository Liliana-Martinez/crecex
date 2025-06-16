import { Component, OnInit, Input } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../componentss/table/table.component';
import { CreditsService } from '../../../../core/services/credits.service';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
import { PrintComponent } from '../../componentss/print/print.component';
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  standalone: true,
  imports: [
    SubmenuuComponent,
    SearchBarComponent,
    FormCreditComponent,
    //SaveButtonComponent,
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
  cliente: any = null;
  datosParaImprimir: any;
  errorMessage: string = '';
  mostrarImpresion = false;
  constructor(private creditsService: CreditsService) {}

  clienteEncontrado(cliente: ClienteConDatos) {
    console.log('Cliente encontrado', cliente);
    this.cliente = cliente; 
  }
  guardarDatosParaImprimir(datos: any) {
  console.log(' Recibido en el padre para imprimir:', datos);
  this.datosParaImprimir = datos;
}

imprimir() {
  if (!this.datosParaImprimir) {
    console.warn(' No hay datos para imprimir');
    return;
  }

  this.mostrarImpresion = false;
}

}

 