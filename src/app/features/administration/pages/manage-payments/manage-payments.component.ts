import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-payments',
  standalone: true,
  imports: [
    RouterModule,
    SearchBarComponent,
    MatTableModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './manage-payments.component.html',
  styleUrl: './manage-payments.component.css'
})
export class ManagePaymentsComponent {

  modulo = 'manage-payments';

  dataManagePayments = new MatTableDataSource<any>([]);

  collectorCol: string[] = [
    'numeroSemana',
    'cantidad',
    'cantidadPagada',
    'fechaEsperada',
    'fechaPagada',
    'acciones'
  ];

  cargarPagos(response: any): void {

    console.log('Respuesta:', response);

    this.dataManagePayments.data = response.pagos || [];

  }

  editarPago(pago: any): void {

    console.log('Editar pago');

    console.log(pago);

    // Aquí posteriormente abrirás un modal
    // y mandarás la información al backend.

  }

  eliminarPago(pago: any): void {

    console.log('Eliminar pago');

    console.log(pago);

    // Aquí posteriormente mostrarás un modal
    // de confirmación y llamarás al backend.

  }

}