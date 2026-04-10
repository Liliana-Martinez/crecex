import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { CommonModule } from '@angular/common';
import { OnChanges, SimpleChanges } from '@angular/core';

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
export class ReportListComponent implements OnChanges {
  dailyIncomeReport = new MatTableDataSource<any>();
  dailyExpenseReport = new MatTableDataSource<any>();
  dailyIncomeReportCol: string[] = ['paymentsIncome', 'extraIncome', 'descriptionIncome', 'totalIncome'];
  dailyExpenseReportCol: string[] = ['creditExpenses', 'extraExpenses', 'descriptionExpenses', 'commissionExpenses', 'supervisor', 'totalExpenses'];
  @Input() type: string = '';
  @Input() incomeData: any;
  @Input() expenseData: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.incomeData && this.expenseData) {
      this.buildTables();
    }
  }

  private buildTables(): void {
    this.buildIncomeTable();
    this.buildExpenseTable();
  }

  private buildIncomeTable(): void {
    const data: any[] = [];
    const transactions = this.incomeData.transactions || [];

    transactions.forEach((t: any, index: number) => {
      const isFirst = index === 0;
      const isLast = index === transactions.length - 1;

      data.push({
        paymentsIncome: isFirst ? this.incomeData.payments : '',
        extraIncome: t.monto,
        descriptionIncome: t.descripcion,
        totalIncome: isLast ? this.incomeData.total : ''
      });
    });

    this.dailyIncomeReport.data = data;
  }

private buildExpenseTable(): void {
  const data: any[] = [];

  // 👉 TOTAL
  data.push({
    creditExpenses: this.expenseData.credits,
    extraExpenses: 0,
    descriptionExpenses: 'TOTAL',
    commissionExpenses: 0,
    supervisor: '',
    totalExpenses: this.expenseData.total
  });

  // 👉 TRANSACTIONS
  if (this.expenseData.transactions) {
    this.expenseData.transactions.forEach((t: any) => {
      data.push({
        creditExpenses: 0,
        extraExpenses: t.monto,
        descriptionExpenses: t.descripcion,
        commissionExpenses: 0,
        supervisor: '',
        totalExpenses: 0
      });
    });
  }

  this.dailyExpenseReport.data = data;
}
}
