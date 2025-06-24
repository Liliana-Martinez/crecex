import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { SaveButtonComponent } from "../../shared/componentes/save-button/save-button.component";
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";
import { MatTableModule } from '@angular/material/table';
import { Zone } from '../../models/Zone';
import { ZoneService } from '../../core/services/zone.service';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-payments',
  imports: [SearchBarZoneComponent, SaveButtonComponent, PrintButtonComponent, MatTableModule, CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})


export class PaymentsComponent {
  constructor(
    private zoneService: ZoneService,
    private paymentService: PaymentService
  ) {}

  paymentCol: string[] = [
    'clients', 'name', 'loans', 'classification', 'compliance', 'deliveryDate',
    'dueDate', 'week', 'weeklyAmount', 'latePayment', 'earlyPayment', 'default',
    'lateFees', 'payment', 'paymentType'
  ];

  idZona: number = 0;
  codigoZona: string = '';
  promotora: string = '';
  fechaSiguienteSemana: string = '';

  zonaSeleccionada: Zone | null = null;
  dataPayment: any = null;
  ClientsPayment: any[] = [];
  mensajeError: string = '';
  idCliente: number = 0;
  selectedOption: string = 'efectivo';

  // Colores por tipo de estado
  getClass(field: string, value: number): string {
    if (field === 'earlyPayment' && value > 0) return 'celda-verde';
    if (field === 'latePayment' && value > 0) return 'celda-roja';
    if (field === 'default' && value > 0) return 'celda-amarilla';
    return '';
  }

  usarZona(zona: Zone) {
    console.log('Zona seleccionada en pagos: ', zona);
    this.zonaSeleccionada = zona;
    this.idZona = zona.id;

    this.zoneService.zoneData(this.idZona).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);

        // Extrae los datos generales
        this.codigoZona = response.codigoZona;
        this.promotora = response.promotora;
        this.fechaSiguienteSemana = response.fechaSiguienteSemana;

        this.ClientsPayment = response.clientes;

        if (this.ClientsPayment && this.ClientsPayment.length > 0) {
          this.dataPayment = this.ClientsPayment.map((item: any, index: number) => ({
            idCredito: item.idCredito,
            clients: index + 1,
            name: item.nombreCompleto,
            loans: item.numeroCreditos,
            classification: item.clasificacion,
            compliance: item.cumplimiento,
            deliveryDate: item.fechaEntrega ? dayjs(item.fechaEntrega).format('DD/MM/YYYY') : '',
            dueDate: item.fechaVencimiento ? dayjs(item.fechaVencimiento).format('DD/MM/YYYY') : '',
            week: item.numeroSemana ?? '',
            weeklyAmount: item.montoSemanal ?? '',
            latePayment: item.atraso ?? '',
            earlyPayment: item.adelanto ?? '',
            default: item.falla ?? '',
            lateFees: item.recargos ?? '',
            payment: '',
            paymentType: ''
          }));
        } else {
          this.dataPayment = [];
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.dataPayment = null;
        this.mensajeError = err.status === 404
          ? 'No hay clientes con créditos activos en esta zona'
          : 'Ocurrió un error al obtener los datos';
      }
    });
  }

  guardarPagos() {
    const pagosAEnviar = this.dataPayment.map((item: any) => ({
      idCredito: item.idCredito,
      lateFees: item.lateFees,
      payment: item.payment,
      paymentType: item.paymentType
    }));

    console.log('Datos a enviar:', pagosAEnviar);

    this.paymentService.enviarPagos(pagosAEnviar).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);

        if (this.zonaSeleccionada) {
          this.usarZona(this.zonaSeleccionada);
        }
      },
      error: (err) => {
        console.error('Error al enviar pagos:', err);
      }
    });
  }
}




