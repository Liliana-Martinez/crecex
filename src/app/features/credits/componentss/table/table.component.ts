import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef } from '@angular/material/table';


export interface RenewCredit { 
  name: string;
  address: string;
  phone: string;
  classification: string;
  loans: string;
  date: string;
  week: string;
  weeklyAmount: string;
  compliance: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnChanges {
  @Input() clienteData: any;

  RenewCreditCol: string[] = [
    'name', 'address', 'phone', 'classification', 
    'loans', 'date', 'week', 'weeklyAmount', 'compliance'
  ];
  
  dataRenewCredit: RenewCredit[] = [];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteData'] && this.clienteData) {
      console.log('Datos recibidos en tabla:', this.clienteData);
      const cliente = this.clienteData.cliente || {};
    const credito = this.clienteData.credito || {};
    const pagos = this.clienteData.pagos || [];
      this.dataRenewCredit = [{
        name: `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
        address: cliente.domicilio || '',
        phone: cliente.telefono || '',
        classification: cliente.clasificacion || '',
        loans: credito.monto?.toString() || '',
        date: credito.fechaEntrega?.split('T')[0] || '', // 👈 formato fecha
        week: pagos[0]?.numeroSemana?.toString() || '',  // 👈 primer pago
        weeklyAmount: pagos[0]?.cantidad?.toString() || '', 
        compliance: '' // Puedes calcularlo si quieres
      }];
      this.cdRef.detectChanges(); // 👈 Forzamos detección de cambios
    }
  }
}
