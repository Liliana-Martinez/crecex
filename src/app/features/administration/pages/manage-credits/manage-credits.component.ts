import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { FormsModule } from '@angular/forms';
import { AdministrationService } from '../../../../core/services/administration.service';


@Component({
  selector: 'app-manage-credits',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    SearchBarComponent,
    SaveButtonComponent,
    FormsModule
  ],
  templateUrl: './manage-credits.component.html',
  styleUrl: './manage-credits.component.css'
})
export class ManageCreditsComponent {

  modulo = 'manage-credits';

  dataManageCredits: any[] = [];
  constructor(
    private administrationService: AdministrationService
  ) {}
  collectorCol = [
    'nombre',
    'monto',
    'abonoSemanal',
    'semanas',
    'fechaEntrega'
  ];

  cargarCredito(response: any): void {

    console.log('Respuesta recibida:', response);
    this.dataManageCredits = [{
    idCredito: response.credito?.idCredito,
    nombre: response.cliente?.nombre,
    monto: response.credito?.monto,
    abonoSemanal: response.credito?.abonoSemanal,
    semanas: response.credito?.semanas,
    fechaEntrega: response.credito?.fechaEntrega,
    referencia: response.credito?.referencia
    }];

    console.log('Datos para la tabla:', this.dataManageCredits);
  }
  //Presiona boton cancelar
  cancelCredit(): void {

  if (!this.dataManageCredits.length) {
    console.log('No hay crédito seleccionado');
    return;
  }

  const idCredito = this.dataManageCredits[0].idCredito;

  console.log('Cancelando crédito:', idCredito);

  this.administrationService
    .cancelCredit(idCredito)
    .subscribe({
      next: (response: any) => {
        console.log('Respuesta del backend:', response);
      },
      error: (error: any) => {
        console.error('Error al cancelar crédito:', error);
      }
    });

}
  //Presiona botn guardaaar
  guardarCambios(): void {

  if (!this.dataManageCredits.length) {
    console.log('No hay crédito seleccionado');
    return;
  }

  const credito = this.dataManageCredits[0];

  const body = {
    idCredito: credito.idCredito,
    monto: Number(credito.monto),
    semanas: Number(credito.semanas)
  };

  console.log('Datos enviados al backend:', body);

  this.administrationService.updateCredit(body)
    .subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
      },
      error: (error) => {
        console.error('Error al actualizar crédito:', error);
      }
    });
}
}