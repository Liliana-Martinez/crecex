import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatisticsService } from '../../../../core/services/statistics.service';
import dayjs from 'dayjs';


@Component({
  selector: 'app-monthly-report-list',
  imports: [MatTableModule, CommonModule],
  templateUrl: './monthly-report-list.component.html',
  styleUrl: './monthly-report-list.component.css'
})
export class MonthlyReportListComponent {
  dataMonthlyRep = new MatTableDataSource<any>();
  monthlyListCol: string[] = ['date', 'paymentsIncome', 'extraIncome', 'descriptionIncome', 'totalIncome', 'expenses', 'extraExpenses', 'descriptionExpenses', 'totalExpenses'];

  constructor (private statisticsService: StatisticsService) {}
    
    ngOnInit(): void {
      this.loadMonthlyReport();
    }

    loadMonthlyReport(): void {
        this.statisticsService.getMonthlyCashReport().subscribe({
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
            this.dataMonthlyRep.data = formattedData;
          },
          error: (err) => {
            console.error('Error al obtener lel reporte diario', err);
          }
        });
      }


}
