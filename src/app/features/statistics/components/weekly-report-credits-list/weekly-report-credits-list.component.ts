import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';


export interface WeeklyReport {
  creditNumber: number;
  creditAmount: number;
  date: Date;  
}

const WEEKLY_DATA: WeeklyReport[] = [
  {creditNumber: 2, creditAmount: 2500, date: new Date("2024-11-18")},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-weekly-report-credits-list',
  imports: [MatTableModule],
  templateUrl: './weekly-report-credits-list.component.html',
  styleUrl: './weekly-report-credits-list.component.css'
})
export class WeeklyReportCreditsListComponent {
  weeklyListCol: string[] = ['creditNumber', 'creditAmount', 'date'];
  dataWeeklyRep = WEEKLY_DATA;
}
