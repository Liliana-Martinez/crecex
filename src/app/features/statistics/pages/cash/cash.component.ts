import { Component } from '@angular/core';
import { SubmenuStatisticsComponent } from '../../components/submenu-statistics/submenu-statistics.component';
import { DailyReportListComponent } from '../../components/daily-reportCash-list/daily-report-list.component';
import { WeeklyReportListComponent } from '../../components/weekly-reportCash-list/weekly-report-list.component';
import { MonthlyReportListComponent } from '../../components/monthly-reportCash-list/monthly-report-list.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';

@Component({
  selector: 'app-cash',
  imports: [SubmenuStatisticsComponent,
    FormsModule, 
    CommonModule,
    DailyReportListComponent, 
    WeeklyReportListComponent,
    MonthlyReportListComponent,
    SaveButtonComponent],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.css'
})
export class CashComponent {
  selectedList: string = "dailyReport";
}
