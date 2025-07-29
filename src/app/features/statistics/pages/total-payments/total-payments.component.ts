import { Component } from '@angular/core';
import { SubmenuStatisticsComponent } from '../../components/submenu-statistics/submenu-statistics.component';
import { SearchBarZoneComponent } from '../../../../shared/componentes/search-bar-zone/search-bar-zone.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { Zone } from '../../../../models/Zone';
import { CommonModule } from '@angular/common';
import dayjs from 'dayjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-total-payments',
  imports: [SubmenuStatisticsComponent, SearchBarZoneComponent, MatTableModule, CommonModule, ReactiveFormsModule],
  templateUrl: './total-payments.component.html',
  styleUrl: './total-payments.component.css'
})

export class TotalPaymentsComponent {
  dataTotalPayments = new MatTableDataSource<any>();
  totalPaymentsCol: string[] = ['paymentNumber', 'clientName', 'creditAmount', 'weeklyAmount', 'paymentDate'];

  formCobranza = new FormGroup({
    weekTotal: new FormControl(''),
    receivedTotal: new FormControl('')
  });

  constructor(private statisticsService: StatisticsService) {}

  onZoneSelected(zone: Zone): void {
    console.log('Zona recibida desde el hijo:', zone);

    this.statisticsService.getCreditsByZone(zone.codigoZona).subscribe({
      next: (response: any) => {
        const data = response.payments;
        const receivedTotal = response.totalReceived;

        const formattedData = data.map((payment: any, index: number) => ({
          paymentNumber: index + 1,
          clientName: payment.clientName,
          creditAmount: payment.creditAmount,
          weeklyAmount: Number(payment.weeklyAmount),
          paymentDate: dayjs(payment.paymentDate).format('DD/MM/YYYY')
        }));

        this.dataTotalPayments.data = formattedData;

        //Calcular el total de la semana
        const weekTotal = formattedData.reduce((sum: number, item: any) => sum + item.weeklyAmount, 0);
        console.log('Total de semana: ', weekTotal);

        //Actualizar los campos del formulario
        this.formCobranza.patchValue({
          weekTotal: weekTotal.toFixed(2),
          receivedTotal: receivedTotal.toFixed(2)
        })

      },
      error: (err) => {
        console.error('Error al obtener créditos por zona', err);
      }
    });
  }
}
