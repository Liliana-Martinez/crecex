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
  constructor(private zoneService: ZoneService,
    private paymentService: PaymentService){}
  //Colores
      getClass(field: string, value: number): string {
        if (field === 'earlyPayment' && value > 0) return 'celda-verde';
        if (field === 'latePayment' && value > 0) return 'celda-roja';
        if (field === 'default' && value > 0) return 'celda-amarilla';
        return '';
      }
  idZona: number = 0;
  dataPayment: any = null;
  ClientsPayment: any[] = [];
  mensajeError: string = '';
  idCliente: number = 0;
  selectedOption: string = 'efectivo';
  paymentCol: string[] = [  
    'clients', 'name', 'loans', 'classification', 'compliance', 'deliveryDate',
    'dueDate', 'week', 'weeklyAmount', 'latePayment', 'earlyPayment','default',
    'lateFees', 'payment', 'paymentType'
  ];
  usarZona(zona: Zone) {
    console.log('Zona seleccionada en pagos: ', zona);
    console.log('codigo zona', zona.codigoZona);
    
    this.idZona = zona.id;
    console.log('id que se va a mandar:', this.idZona);

   

    // Servicio Zona
    this.zoneService.zoneData(this.idZona).subscribe({
      next: (response) => {
        this.dataPayment = response; 
        console.log('Respuesta del back: ', response);
        //Llenado de tabla :3
        this.ClientsPayment= response; 
        console.log('Lo que va a llenar la tabla: ',this.ClientsPayment);
        if (this.ClientsPayment) {
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
            default: item.falla??'',
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

        if (err.status === 404) {
          this.dataPayment = null;
          this.mensajeError = 'No hay clientes con creditos activos en esta zona';
        } else {
          this.mensajeError = 'Ocurrió un error al obtener los datos';
        }
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
      },
      error: (err) => {
        console.error('Error al enviar pagos:', err);
      }
    });
  }



}

