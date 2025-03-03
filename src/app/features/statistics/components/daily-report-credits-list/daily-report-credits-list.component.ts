import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface DailyReport {
  creditNumber: number;
  creditAmount: number;
  date: Date;  
}

const DAILY_DATA: DailyReport[] = [
  {creditNumber: 23, creditAmount: 2500, date: new Date("2025-03-01")},
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-daily-report-credits-list',
  imports: [MatTableModule],
  templateUrl: './daily-report-credits-list.component.html',
  styleUrl: './daily-report-credits-list.component.css'
})
export class DailyReportCreditsListComponent {
  dailyListCol: string[] = ['creditNumber', 'creditAmount', 'date'];
  dataDailyRep = DAILY_DATA;
}
