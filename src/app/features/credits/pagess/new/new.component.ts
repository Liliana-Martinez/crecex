import { Component, OnInit } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../componentss/table/table.component';
import { CreditsService } from '../../../../core/services/credits.service';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
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
    TableComponent
  ] 
})
export class NewComponent {
  modulo: string = 'new';
  cliente: any = null;
  formulario: any = null;
  errorMessage: string = '';

  constructor(private creditsService: CreditsService) {}

  mostrarClienteEnTabla(cliente: any) {
    console.log('Cliente recibido en new.component:', cliente);
    this.cliente = cliente;
  }
  guardarFormulario(data: any): void { 
    if (!this.cliente) {
      this.errorMessage = 'Seleccione un cliente antes de continuar.';
      return;
    }
    this.errorMessage = '';
    const payload = {
      ...data, 
      idCliente: this.cliente.idCliente,  
      modulo: this.modulo, 
    };
    console.log('Payload a enviar:', payload);
    this.creditsService.enviarFormulario('new', payload).subscribe(
      (response) => {
        console.log('Crédito guardado exitosamente:', response);
      },
      (error) => {
        console.error('Error al guardar el crédito', error);
      }
    );
  }
  
}

