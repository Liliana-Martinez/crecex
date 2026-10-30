
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { AdministrationService } from '../../../../core/services/administration.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-manage-payments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchBarComponent,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './manage-payments.component.html',
  styleUrl: './manage-payments.component.css'
})
export class ManagePaymentsComponent {

  modulo = 'manage-payments';

  dataManagePayments = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'numeroSemana',
    'cantidad',
    'cantidadPagada',
    'fechaEsperada',
    'fechaPagada',
    'acciones'
  ];

  constructor(
    private administrationService: AdministrationService
  ) {}

  cargarPagos(response: any): void {
    console.log('Respuesta:', response);
    this.dataManagePayments.data = response?.pagos || [];
  }

  eliminarPago(pago: any): void {
    console.log('Eliminar pago');
    console.log(pago);
  }
 ejecutarProceso(proceso: string): void {
  const procesos: Record<string, () => Observable<any>> = {
    atrasos: () => this.administrationService.ejecutarAtrasos(),
    adelantos: () => this.administrationService.ejecutarAdelantos(),
    falla: () => this.administrationService.ejecutarFalla()
  };
  const ejecutar = procesos[proceso];
  if (!ejecutar) {
    console.error('Proceso no válido:', proceso);
    return;
  }
  ejecutar().subscribe({
    next: (response) => {
      console.log('Respuesta del servidor:', response);
      alert(response.message || 'Conexión con el servidor correcta');
    },
    error: (error) => {
      console.error('Error al ejecutar el proceso:', error);
      alert('Error al conectar con el servidor');
    }
  });
}
}
