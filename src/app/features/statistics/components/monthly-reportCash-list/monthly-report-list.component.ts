import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface MonthlyReport {
  date: Date;
  income: number;
  extraIncome: number;
  totalIncome: number;
  expenses: number;
  extraExpenses: number;
  totalExpenses: number;
}

const MONTHLY_DATA: MonthlyReport[] = [
  {date: new Date("2024-11-25"), income: 3000, extraIncome: 2000, totalIncome: 5000, expenses: 5000, extraExpenses: 1000, totalExpenses: 6000},
];

@Component({
  selector: 'app-monthly-report-list',
  imports: [MatTableModule],
  templateUrl: './monthly-report-list.component.html',
  styleUrl: './monthly-report-list.component.css'
})
export class MonthlyReportListComponent {
  monthlyListCol: string[] = ['date', 'income', 'extraIncome', 'totalIncome', 'expenses', 'extraExpenses', 'totalExpenses'];
  dataMonthlyRep = MONTHLY_DATA;
}
