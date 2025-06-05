import { Component } from '@angular/core';
import { SearchBarZoneComponent } from '../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { SaveButtonComponent } from "../../shared/componentes/save-button/save-button.component";
import { PrintButtonComponent } from "../../shared/componentes/print-button/print-button.component";
import { MatTableModule } from '@angular/material/table';
import { Zone } from '../../models/Zone';
import { ZoneService } from '../../core/services/zone.service';
import { ClientsPayment } from '../../models/ClientsPayment';

@Component({
  selector: 'app-payments',
  imports: [SearchBarZoneComponent, SaveButtonComponent, PrintButtonComponent, MatTableModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})


export class PaymentsComponent {
  constructor(private zoneService: ZoneService) {}

  idZona: number = 0;
  dataPayment: any = null;
  paymentResponse: ClientsPayment | null = null;
  paymentCol: string[] = [
    'clients', 'name', 'loans', 'classification', 'compliance', 'deliveryDate',
    'dueDate', 'week', 'weeklyAmount', 'latePayment', 'earlyPayment',
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
        console.log('Respuesta del back: ', response);
        this.paymentResponse= response; // Asigna los datos a la tabla si hay
      },
      error: (err) => {
        console.error('Error:', err);

        if (err.status === 404) {
          this.dataPayment = null;
        } else {
          this.dataPayment = null;
        }
      }
    });
  }
}

