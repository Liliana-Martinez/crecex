import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';

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

  cargarPagos(response: any): void {

    console.log('Respuesta:', response);

    this.dataManagePayments.data = response?.pagos || [];

  }

  editarPago(pago: any): void {

    console.log('Editar pago');
    console.log(pago);

    // Posteriormente:
    // 1. Abrir modal
    // 2. Cargar información del pago
    // 3. Editar
    // 4. Enviar cambios al backend

  }

  eliminarPago(pago: any): void {

    console.log('Eliminar pago');
    console.log(pago);

    // Posteriormente:
    // 1. Mostrar confirmación
    // 2. Eliminar en backend
    // 3. Actualizar la tabla

  }
  ejecutarProceso(proceso: string): void {

  console.log('Ejecutando proceso:', proceso);

}
}