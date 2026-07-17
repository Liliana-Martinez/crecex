import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { StatisticsService } from '../../../../core/services/statistics.service';


@Component({
  selector: 'app-total-payments',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatTableModule ],
  templateUrl: './total-payments.component.html',
  styleUrl: './total-payments.component.css'
})

export class TotalPaymentsComponent {
  selectedList: string= "daily";
  collectionSummaryForm!: FormGroup;
  paymentSummary = new MatTableDataSource<any>();
  paymentSummaryCol: string[] = ['collectedAmount', 'collectedAmountPercentage', 'outstandingAmount', 'outstandingAmountPercentage'];
  totalDebt: number = 0;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.getPaymentSummary();
  }
  
  onReportTypeChange(value: string): void {
    console.log('tipo de reporte: ', value);
    this.selectedList = value;
    this.getPaymentSummary();
  }

  private getPaymentSummary(): void {
    this.statisticsService.getPaymentSummary(this.selectedList).subscribe({
      next:(response) => {
        const summaryRow = {
          collectedAmount: response.summary.collectedAmount,
          collectedAmountPercentage: response.summary.collectedAmountPercentage,
          outstandingAmount: response.summary.outstandingAmount,
          outstandingAmountPercentage: response.summary.outstandingAmountPercentage
        };

        this.paymentSummary.data = [summaryRow];
      },
      error: (error) => {
        console.log('Error al obtener el reporte: ', error);
      }
    });
  }
}
 