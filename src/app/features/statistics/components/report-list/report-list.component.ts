import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { OnChanges, SimpleChanges } from '@angular/core';
import dayjs from 'dayjs';

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
  incomeReport = new MatTableDataSource<any>();
  expensesReport = new MatTableDataSource<any>();
  commissionExpensesReport = new MatTableDataSource<any>();
  incomeReportCol: string[] = ['date', 'paymentsIncome', 'extraIncome', 'descriptionIncome', 'totalIncome'];
  expensesReportCol: string[] = ['date', 'creditExpense', 'extraExpense', 'descriptionExpense', 'totalExpenses'];
  commissionExpensesReportCol: string[] = ['date', 'commissionExpense', 'commissionExpenseDescription', 'commissionExpensesTotal'];
  @Input() type: string = '';
  @Input() incomeData: any;
  @Input() expenseData: any;
  @Input() commissionExpenseData: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.incomeData && !this.expenseData && !this.commissionExpenseData) return;

    this.setColumns();
    this.buildTables();
  }

  private buildTables(): void {
    this.buildIncomeTable();
    this.buildExpenseTable();
    this.buildCommissionTable();
  }

  private buildIncomeTable(): void {
    const data: any[] = [];
    const transactions = this.incomeData.transactions || [];

    transactions.forEach((t: any, index: number) => {
      const isFirst = index === 0;
      const isLast = index === transactions.length - 1;

      data.push({
        date: dayjs(t.fecha).format('DD-MM-YYYY'),
        paymentsIncome: isFirst ? this.incomeData.payments : '',
        extraIncome: t.monto,
        descriptionIncome: t.descripcion,
        totalIncome: isLast ? this.incomeData.total : ''
      });
    });

    this.incomeReport.data = data;
  }

  private buildExpenseTable(): void {
    const data: any[] = [];
    const transactions = this.expenseData.transactions || [];

    transactions.forEach((t: any, index: number) => {
      const isFirst = index === 0;
      const isLast = index === transactions.length - 1;

      data.push({
        date: dayjs(t.fecha).format('DD-MM-YYYY'),
        creditExpense: isFirst ? this.expenseData.credits: '',
        extraExpense: t.monto,
        descriptionExpense: t.descripcion,
        totalExpenses: isLast ? this.expenseData.total : ''
      });
    });
    this.expensesReport.data = data;
  }

  private buildCommissionTable(): void {
    const data: any[] = [];
    const commissions = this.expenseData.commissions || [];

    commissions.forEach((c: any, index: number) => {
      const isLast = index === commissions.length - 1;

      data.push({
        date: dayjs(c.fecha).format('DD-MM-YYYY'),
        commissionExpense: c.monto,
        commissionExpenseDescription: 'Comisión',
        commissionExpensesTotal: isLast ? this.getTotalCommissions(commissions) : ''
      });
    });

    this.commissionExpensesReport.data = data;
  }

  private setColumns(): void {
    if (this.type === 'daily') {
      this.incomeReportCol = ['paymentsIncome', 'extraIncome', 'descriptionIncome', 'totalIncome'];
      this.expensesReportCol = ['creditExpense', 'extraExpense', 'descriptionExpense', 'totalExpenses'];
      this.commissionExpensesReportCol = ['commissionExpense', 'commissionExpenseDescription', 'commissionExpensesTotal'];
    } else {
      this.incomeReportCol = ['date', 'paymentsIncome', 'extraIncome', 'descriptionIncome', 'totalIncome'];
      this.expensesReportCol = ['date', 'creditExpense', 'extraExpense', 'descriptionExpense', 'totalExpenses'];
      this.commissionExpensesReportCol = ['date', 'commissionExpense', 'commissionExpenseDescription', 'commissionExpensesTotal'];
    }
  }

  private getTotalCommissions(commissions: any[]): number {
    return commissions.reduce((sum: number, c: any) => sum + c.monto, 0);
  }
}
