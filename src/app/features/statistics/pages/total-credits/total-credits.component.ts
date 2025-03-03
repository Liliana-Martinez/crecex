import { Component } from '@angular/core';
import { SubmenuStatisticsComponent } from '../../components/submenu-statistics/submenu-statistics.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DailyReportCreditsListComponent } from '../../components/daily-report-credits-list/daily-report-credits-list.component';
import { WeeklyReportCreditsListComponent } from '../../components/weekly-report-credits-list/weekly-report-credits-list.component';
import { MonthlyReportCreditsListComponent } from '../../components/monthly-report-credits-list/monthly-report-credits-list.component';

@Component({
  selector: 'app-total-credits',
  imports: [SubmenuStatisticsComponent, 
    FormsModule, 
    CommonModule,
    DailyReportCreditsListComponent,
    WeeklyReportCreditsListComponent,
    MonthlyReportCreditsListComponent],
  templateUrl: './total-credits.component.html',
  styleUrl: './total-credits.component.css'
})
export class TotalCreditsComponent {
  selectedList: string = "dailyCredits";
}
