import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface DailyReport {
  date: Date;
  income: number;
  extraIncome: number;
  totalIncome: number;
  expenses: number;
  extraExpenses: number;
  totalExpenses: number;
}

const DAILY_DATA: DailyReport[] = [
  {date: new Date("2025-03-01"), income: 3000, extraIncome: 2000, totalIncome: 5000, expenses: 5000, extraExpenses: 1000, totalExpenses: 6000},
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-daily-report-list',
  imports: [MatTableModule],
  templateUrl: './daily-report-list.component.html',
  styleUrl: './daily-report-list.component.css'
})
export class DailyReportListComponent {
  dailyListCol: string[] = ['date', 'income', 'extraIncome', 'totalIncome', 'expenses', 'extraExpenses', 'totalExpenses'];
  dataDailyRep = DAILY_DATA;
}
