import { Component,EventEmitter, Output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatisticsService } from '../../../../core/services/statistics.service';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';
export interface DailyReport {
  creditNumber: number;
  creditAmount: number;
  date: Date;
  promoter: string;
  client: string;
  creditWeeks: number;
}


@Component({
  selector: 'app-daily-report-credits-list',
  imports: [MatTableModule, CommonModule],
  templateUrl: './daily-report-credits-list.component.html',
  styleUrl: './daily-report-credits-list.component.css'
})

export class DailyReportCreditsListComponent {
  dataDailyRep = new MatTableDataSource<any>();
  dailyListCol: string[] = ['idCredit', 'creditAmount', 'date', 'promoter', 'client', 'creditWeeks'];
  //Manda a total-credits
  @Output() creditosEmit = new EventEmitter<any[]>();
  constructor (private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadDailyCredits();
  }

  loadDailyCredits(): void {
    this.statisticsService.getDailyCredits().subscribe({
    next: (data: any[]) => {
      console.log('Datos crudos del backend:', data);
      const formattedData = data.map((credit) => ({
        idCredit: credit.idCredito,
        creditAmount: credit.creditAmount,
        date: dayjs(credit.date).format('DD/MM/YYYY'),
        promoter: credit.promoter,
        client: credit.client,
        creditWeeks: credit.creditWeeks,
        typeCredit: credit.typeCredit
      }));

      this.dataDailyRep.data = formattedData;
      //Envia a total credist
      console.log('ENVIANDO AL PADRE PARA IMPRIMIR DIA:', formattedData);

      this.creditosEmit.emit(formattedData);
      console.log('Créditos del día (formateados):', formattedData);
    },
      error: (err) => {
        console.error('Error al obtener los creditos del dia', err);
      }
    });
  }

  getTotalCreditAmount(): number {
    return this.dataDailyRep.data
      .map(item => item.creditAmount)
      .reduce((acc, value) => acc + value, 0);
  }
}
