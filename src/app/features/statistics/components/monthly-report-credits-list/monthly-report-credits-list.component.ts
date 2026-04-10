import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatisticsService } from '../../../../core/services/statistics.service';
import dayjs from 'dayjs';


@Component({
  selector: 'app-monthly-report-credits-list',
  imports: [MatTableModule, CommonModule],
  templateUrl: './monthly-report-credits-list.component.html',
  styleUrl: './monthly-report-credits-list.component.css'
})
export class MonthlyReportCreditsListComponent {
  dataMonthlyRep = new MatTableDataSource<any>();
  monthlyListCol: string[] = ['idCredit', 'creditAmount', 'date', 'promoter', 'client', 'creditWeeks']; 

  constructor (private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadMonthlyCredits();
  }

  loadMonthlyCredits(): void {
    this.statisticsService.getMonthlyCredits().subscribe({
      next: (data: any[]) => {
        const formattedData = data.map((credit) => ({
          idCredit: credit.idCredito,
          creditAmount: credit.creditAmount,
          date: dayjs(credit.date).format('DD/MM/YYYY'),
          promoter: credit.promoter,
          client: credit.client,
          creditWeeks: credit.creditWeeks
        }));
        this.dataMonthlyRep.data = formattedData;
        console.log('Créditos del mes:', formattedData);
      },
      error: (err) => {
        console.error('Error al obtener los creditos del mes', err);
      }
    });
  }

  getTotalCreditAmount(): number {
    return this.dataMonthlyRep.data
      .map(item => item.creditAmount)
      .reduce((acc, value) => acc + value, 0);
  }
}
