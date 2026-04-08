import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { CommonModule } from '@angular/common';

export interface DailyIncomeReport {
  income: number;
  extraIncome: number;
  totalIncome: number;
}

export interface DailyExpenseReport {
  creditExpenses: number;
  extraExpenses: number;
  descriptionExpenses: String;
  commissionExpenses: number;
  supervisor: String;
  totalExpenses: number;
}

@Component({
  selector: 'app-report-list',
  imports: [MatTableModule, CommonModule],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent {
  dailyIncomeReport = new MatTableDataSource<any>();
  dailyExpenseReport = new MatTableDataSource<any>();
  dailyIncomeReportCol: string[] = ['paymentsIncome', 'extraIncome', 'descriptionIncome', 'totalIncome'];
  dailyExpenseReportCol: string[] = ['creditExpenses', 'extraExpenses', 'descriptionExpenses', 'commissionExpenses', 'supervisor', 'totalExpenses'];
  @Input() type: string = '';

  constructor (private statisticsService: StatisticsService) {}
  
  ngOnInit(): void {
    this.loadDailyReport();
  }

  loadDailyReport(): void {
    
  }
}
