import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatisticsService } from '../../../../core/services/statistics.service';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-weekly-report-list',
  imports: [MatTableModule, CommonModule],
  templateUrl: './weekly-report-list.component.html',
  styleUrl: './weekly-report-list.component.css'
})
export class WeeklyReportListComponent {
  weeklyListCol: string[] = ['date', 'paymentsIncome', 'extraIncome', 'descriptionIncome', 'totalIncome', 'expenses', 'extraExpenses', 'descriptionExpenses', 'totalExpenses'];
  dataWeeklyRep = new MatTableDataSource<any>();

  constructor (private statisticsService: StatisticsService) {}
  
    ngOnInit(): void {
      this.loadWeeklyReport();
    }

    loadWeeklyReport(): void {
        this.statisticsService.getWeeklyCashReport().subscribe({
              next: (data: any[]) => {
                console.log('Datos del back: ', data);
                const formattedData = data.map((consult) => ({
                  date: dayjs(consult.date).format('DD/MM/YYYY'),
                  paymentsIncome: consult.paymentsIncome,
                  extraIncome: consult.extraIncome,
                  descriptionIncome: consult.descriptionIncome,
                  totalIncome: (consult.paymentsIncome || 0) + (consult.extraIncome || 0),
                  expenses: consult.expenses,
                  extraExpenses: consult.extraExpenses,
                  descriptionExpenses: consult.descriptionExpenses,
                  totalExpenses: (consult.expenses || 0) + (consult.extraExpenses || 0)
                }));
                this.dataWeeklyRep.data = formattedData;
              },
              error: (err) => {
                console.error('Error al obtener lel reporte diario', err);
              }
            });
      }

}
