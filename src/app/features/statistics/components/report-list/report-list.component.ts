import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { OnChanges, SimpleChanges } from '@angular/core';
import dayjs from 'dayjs';

export interface DailyIncomeReport {
  income: number;
  extraIncome: number;
  totalIncome: number;
}

export interface DailyExpenseReport {
  extraExpenses: number;
  descriptionExpenses: String;
  commissionExpenses: number;
  supervisor: String;
}

@Component({
  selector: 'app-report-list',
  imports: [MatTableModule, CommonModule, MatCardModule],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent implements OnChanges {
  incomeReport = new MatTableDataSource<any>();
  expensesReport = new MatTableDataSource<any>();
  commissionExpensesReport = new MatTableDataSource<any>();
  incomeReportCol: string[] = ['date', 'extraIncome', 'descriptionIncome'];
  expensesReportCol: string[] = ['date', 'extraExpense', 'descriptionExpense'];
  commissionExpensesReportCol: string[] = ['date', 'commissionExpense', 'commissionExpenseDescription', 'commissionExpensesTotal'];
  @Input() type: string = '';
  @Input() incomeData: any;
  @Input() expenseData: any;
  @Input() commissionExpenseData: any;
  paymentsIncome: number = 0;
  totalIncome: number = 0;
  creditExpense: number = 0;
  totalExpense: number = 0;
  commissionExpensesTotal: number = 0;

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
    this.paymentsIncome = this.incomeData.payments;
    this.totalIncome = this.incomeData.total;

    transactions.forEach((t: any) => {
      data.push({
      date: dayjs(t.fecha).format('DD-MM-YYYY'),
      extraIncome: t.monto,
      descriptionIncome: t.descripcion
      });
    });

    this.incomeReport.data = data;
  }

  private buildExpenseTable(): void {
    const data: any[] = [];
    const transactions = this.expenseData.transactions || [];
    this.creditExpense = this.expenseData.credits;
    this.totalExpense = this.expenseData.total;

    transactions.forEach((t: any, index: number) => {

      data.push({
        date: dayjs(t.fecha).format('DD-MM-YYYY'),
        extraExpense: t.monto,
        descriptionExpense: t.descripcion
      });
    });
    this.expensesReport.data = data;
  }

  private buildCommissionTable(): void {
    const data: any[] = [];
    const commissions = this.expenseData.commissions || [];
    this.commissionExpensesTotal = this.expenseData.commissions.total;

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
      this.incomeReportCol = ['extraIncome', 'descriptionIncome'];
      this.expensesReportCol = ['extraExpense', 'descriptionExpense',];
      this.commissionExpensesReportCol = ['commissionExpense', 'commissionExpenseDescription', 'commissionExpensesTotal'];
    } else {
      this.incomeReportCol = ['date', 'extraIncome', 'descriptionIncome'];
      this.expensesReportCol = ['date', 'extraExpense', 'descriptionExpense'];
      this.commissionExpensesReportCol = ['date', 'commissionExpense', 'commissionExpenseDescription', 'commissionExpensesTotal'];
    }
  }

  private getTotalCommissions(commissions: any[]): number {
    return commissions.reduce((sum: number, c: any) => sum + c.monto, 0);
  }
}
