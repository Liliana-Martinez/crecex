import { Component, Input } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { TableComponent } from '../../componentss/table/table.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { PrintButtonComponent } from "../../../../shared/componentes/print-button/print-button.component";
import { CreditsService } from '../../../../core/services/credits.service';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
import { PrintComponent } from '../../componentss/print/print.component';

@Component({
  selector: 'app-additional',
  imports: [SubmenuuComponent, 
            FormCreditComponent, 
            TableComponent, 
            CommonModule, 
            SearchBarComponent, 
            PrintButtonComponent, 
            PrintComponent],
  templateUrl: './additional.component.html',
  styleUrl: './additional.component.css'
})
export class AdditionalComponent {
  @Input() response: any = null;
  modulo: string = 'additional';
  cliente: any = null;
  errorMessage: string = '';
  datosParaImprimir: any;
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
  setTimeout(() => {
    this.mostrarImpresion = true;
  }, 100);
}
   

} 
 