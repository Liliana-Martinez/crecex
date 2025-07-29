import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatisticsService } from '../../../../core/services/statistics.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-weekly-report-credits-list',
  imports: [MatTableModule, CommonModule],
  templateUrl: './weekly-report-credits-list.component.html',
  styleUrl: './weekly-report-credits-list.component.css'
})
export class WeeklyReportCreditsListComponent {
  
  dataWeeklyRep = new MatTableDataSource<any>();
  weeklyListCol: string[] = ['idCredit', 'creditAmount', 'date'];

  constructor (private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadWeeklyCredits();
  }

  loadWeeklyCredits(): void {
    this.statisticsService.getWeeklyCredits().subscribe({
      next: (data: any[]) => {
        const formattedData = data.map((credit) => ({
          idCredit: credit.idCredito,
          creditAmount: credit.creditAmount,
          date: dayjs(credit.fecha).format('DD/MM/YYYY'),
        }));
        this.dataWeeklyRep.data = formattedData;
        console.log('Creditos de la semana: ', formattedData);
      },
      error: (err) => {
        console.error('Error al obtener los creditos de la semana', err);
      }
    });
  }
  
  getTotalCreditAmount(): number {
    return this.dataWeeklyRep.data
      .map(item => item.creditAmount)
      .reduce((acc, value) => acc + value, 0);
  }
}
