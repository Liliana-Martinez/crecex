import { Component } from '@angular/core';
import { SubmenuStatisticsComponent } from '../../components/submenu-statistics/submenu-statistics.component';
import { DailyReportListComponent } from '../../components/daily-report-list/daily-report-list.component';
import { WeeklyReportListComponent } from '../../components/weekly-report-list/weekly-report-list.component';
import { MonthlyReportListComponent } from '../../components/monthly-report-list/monthly-report-list.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cash',
  imports: [SubmenuStatisticsComponent,
    FormsModule, 
    CommonModule,
    DailyReportListComponent, 
    WeeklyReportListComponent,
    MonthlyReportListComponent],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.css'
})
export class CashComponent {
  selectedList: string = "dailyReport";
}
