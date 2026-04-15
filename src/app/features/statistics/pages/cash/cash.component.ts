import { Component } from '@angular/core';
import { ReportListComponent } from '../../components/report-list/report-list.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValueChangeEvent } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { API_ROUTES } from '../../../../core/constants/api-routes';

interface TransactionPayload {
  income?: {
    amount: number;
    description: string;
  };
  expense?: {
    amount: number;
    description: string;
  }
}

@Component({
  selector: 'app-cash',
  imports: [
    FormsModule, 
    CommonModule,
    ReportListComponent,
    SaveButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.css'
})

export class CashComponent {
  selectedList: string = "daily";
  incomeExpensesForm!: FormGroup;
  currentDate: string = '';
  incomeData: any;
  expenseData: any;
  commissionExpenseData: any;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void { 
    this.initForm();
    this.getReportData(); //Cargar los datos iniciales para el formulario y tablas
  }

  private initForm(): void {
    this.incomeExpensesForm = new FormGroup({
      totalCash: new FormControl(''),
      incomeForm: new FormGroup({
        income: new FormControl({value: 0, disabled: true}),
        extraIncome: new FormControl(''),
        descriptionIncome: new FormControl(''),
        totalIncome: new FormControl('')
      }),
      expensesForm: new FormGroup({
        expenses: new FormControl({value: 0, disabled: true}),
        extraExpense: new FormControl(''),
        descriptionExpense: new FormControl(''),
        totalExpenses: new FormControl('')
      }),
      commissionExpenses: new FormControl({value: 0, disabled: true})
    });
  }

  //Detectar el tipo de reporte (daily, weekly o monthly)
  onReportTypeChange(value: string): void {
    console.log('Valor del select: ', value);
    this.selectedList = value;
    this.getReportData(); //Recargar datos del reporte que se haya seleccionado
  }

  //Llamada para traer datos para rellenar algunos inputs del formulario y para mostrar en las tablas
  private getReportData(): void {
    console.log('URL base:', API_ROUTES.STATISTICS.CASH.GET_REPORT);
    console.log('tipo de reporte antes de enviar al back: ', this.selectedList);
    this.statisticsService.getCashReport(this.selectedList).subscribe({
      next: (response) => {
        console.log('response: ', response);

        this.incomeData = response.income;
        this.expenseData = response.expenses;
        this.commissionExpenseData = response.expenses.commissions;

        /*console.log('incomeData: ', this.incomeData);
        console.log('expenseData: ', this.expenseData);*/
        console.log('commissionExpense: ', this.commissionExpenseData);

        this.incomeExpensesForm.patchValue({
          totalCash: response.cash.totalCash,
          incomeForm: {
            income: response.dailyData.income,
            totalIncome: response.dailyData.totalIncome
          },
          expensesForm: {
            expenses: response.dailyData.expenses,
            totalExpenses: response.dailyData.totalExpenses
          },
          commissionExpenses: response.dailyData.commissions
        });
      },
      error: (error) => {
        console.error('Error al obtener los datos del reporte: ', error);
      }
    });

  }

  //Agregar ingreso/egreso o ambos
  addTransaction(): void {
    const incomeForm = this.incomeExpensesForm.get('incomeForm')?.value;
    const expensesForm = this.incomeExpensesForm.get('expensesForm')?.value;

    const dataToSend: any = {};

    if (incomeForm.extraIncome && Number(incomeForm.extraIncome) > 0) {
      dataToSend.income = {
        amount: incomeForm.extraIncome,
        description: incomeForm.descriptionIncome
      };
    }

    if (expensesForm.extraExpense && Number(expensesForm.extraExpense) > 0) {
      dataToSend.expense = {
        amount: expensesForm.extraExpense,
        description: expensesForm.descriptionExpense
      };
    }

    if (!dataToSend.income && !dataToSend.expense) {
      console.warn('No hay datos para guardar.');
      return;
    }

    console.log('dataToSend: ', dataToSend);
    this.statisticsService.addTransaction(dataToSend).subscribe(() => {
      this.getReportData();

      console.log('Se agrego el movimiento correctamente.');

      //Limpiar el formulario
      this.incomeExpensesForm.patchValue({
        incomeForm: {
          extraIncome: '',
          descriptionIncome: ''
        },
        expensesForm: {
          extraExpense: '',
          descriptionExpense: ''
        }
      });
    });
  }
}
