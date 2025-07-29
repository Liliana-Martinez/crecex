import { Component } from '@angular/core';
import { SubmenuStatisticsComponent } from '../../components/submenu-statistics/submenu-statistics.component';
import { DailyReportListComponent } from '../../components/daily-reportCash-list/daily-report-list.component';
import { WeeklyReportListComponent } from '../../components/weekly-reportCash-list/weekly-report-list.component';
import { MonthlyReportListComponent } from '../../components/monthly-reportCash-list/monthly-report-list.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { StatisticsService } from '../../../../core/services/statistics.service';

@Component({
  selector: 'app-cash',
  imports: [
    SubmenuStatisticsComponent,
    FormsModule, 
    CommonModule,
    DailyReportListComponent, 
    WeeklyReportListComponent,
    MonthlyReportListComponent,
    SaveButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.css'
})
export class CashComponent {
  selectedList: string = "dailyReport";
  incomeExpensesForm!: FormGroup;
  currentDate: string = '';

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {

    const today = new Date();
    const isMonday = today.getDay() === 1;

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    };
    //Formato en español
    this.currentDate = today.toLocaleDateString('es-MX', options);

    this.incomeExpensesForm = new FormGroup({
      initialAmount: new FormControl({ value: '', disabled: !isMonday }),
      incomeForm: new FormGroup({
        income: new FormControl(''),
        extraIncome: new FormControl(''),
        descriptionIncome: new FormControl(''),
        totalIncome: new FormControl('')
      }),
      expensesForm: new FormGroup({
        expenses: new FormControl(''),
        extraExpenses: new FormControl(''),
        descriptionExpenses: new FormControl(''),
        totalExpenses: new FormControl('')
      }),
      totalCash: new FormControl('')
    });

    if (!isMonday) {
      this.getInitialAmount();
    }

    this.setupListeners();
  
  }

  getInitialAmount() {
    this.statisticsService.getInitialAmountDaily().subscribe({
    next: (res) => {
      if (res && res.monto !== null && res.monto !== undefined) {
        this.incomeExpensesForm.patchValue({ initialAmount: res.monto });
      }
    },
    error: (err) => {
      console.error('Error al obtener el monto inicial:', err);
    }
  });
  }

  setupListeners() {
    // Cuando cambia algo en ingresos
    this.incomeExpensesForm.get('incomeForm')!.valueChanges.subscribe(() => {
      this.calculateTotalIncome();
      this.calculateTotalCash();
    });

    // Cuando cambia algo en egresos
    this.incomeExpensesForm.get('expensesForm')!.valueChanges.subscribe(() => {
      this.calculateTotalExpenses();
      this.calculateTotalCash();
    });

    // Si cambia el monto inicial
    this.incomeExpensesForm.get('initialAmount')!.valueChanges.subscribe(() => {
      this.calculateTotalCash();
    });
  }

  calculateTotalIncome() {
    const incomeGroup = this.incomeExpensesForm.get('incomeForm')!.value;
    const income = parseFloat(incomeGroup.income) || 0;
    const extraIncome = parseFloat(incomeGroup.extraIncome) || 0;

    const total = income + extraIncome;
    this.incomeExpensesForm.get('incomeForm.totalIncome')!.setValue(total, { emitEvent: false });
  }

  calculateTotalExpenses() {
    const expenseGroup = this.incomeExpensesForm.get('expensesForm')!.value;
    const expenses = parseFloat(expenseGroup.expenses) || 0;
    const extraExpenses = parseFloat(expenseGroup.extraExpenses) || 0;

    const total = expenses + extraExpenses;
    this.incomeExpensesForm.get('expensesForm.totalExpenses')!.setValue(total, { emitEvent: false });
  }

  calculateTotalCash() {
    const initial = parseFloat(this.incomeExpensesForm.get('initialAmount')!.value) || 0;

    const totalIncome = this.incomeExpensesForm.get('incomeForm.totalIncome')!.value || 0;
    const totalExpenses = this.incomeExpensesForm.get('expensesForm.totalExpenses')!.value || 0;

    const total = initial + totalIncome - totalExpenses;
    this.incomeExpensesForm.get('totalCash')!.setValue(total, { emitEvent: false });
  }
}
