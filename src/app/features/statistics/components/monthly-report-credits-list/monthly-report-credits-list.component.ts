import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface MonthlyReport {
  creditNumber: number;
  creditAmount: number;
  date: Date;  
}

const MONTHLY_DATA= null;

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-monthly-report-credits-list',
  imports: [MatTableModule],
  templateUrl: './monthly-report-credits-list.component.html',
  styleUrl: './monthly-report-credits-list.component.css'
})
export class MonthlyReportCreditsListComponent {
  monthlyListCol: string[] = ['creditNumber', 'creditAmount', 'date'];
  dataMonthlyRep = MONTHLY_DATA;
}
