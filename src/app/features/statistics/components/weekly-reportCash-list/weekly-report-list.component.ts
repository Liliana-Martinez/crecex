import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface WeeklyReport {
  date: Date;
  income: number;
  extraIncome: number;
  totalIncome: number;
  expenses: number;
  extraExpenses: number;
  totalExpenses: number;
}

const WEEKLY_DATA: WeeklyReport[] = [
  {date: new Date("2024-12-20"), income: 3000, extraIncome: 2000, totalIncome: 5000, expenses: 5000, extraExpenses: 1000, totalExpenses: 6000},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-weekly-report-list',
  imports: [MatTableModule],
  templateUrl: './weekly-report-list.component.html',
  styleUrl: './weekly-report-list.component.css'
})
export class WeeklyReportListComponent {
  weeklyListCol: string[] = ['date', 'income', 'extraIncome', 'totalIncome', 'expenses', 'extraExpenses', 'totalExpenses'];
  dataWeeklyRep = WEEKLY_DATA;
}
