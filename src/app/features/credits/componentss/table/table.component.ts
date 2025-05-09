import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
import dayjs from 'dayjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent  {
  @Input() cliente:ClienteConDatos | null = null
  dataSource = new MatTableDataSource < any >([]);
  creditTableColums: string [] = ['name', 'address', 'phone', 'classification', 'loans','date','week','weeklyAmount', 'compliance'];
  ngOnChanges(changes: SimpleChanges){
    console.log('datos recibidos en tabla', this.cliente);
    if(changes['cliente'] && this.cliente){
      this.dataSource.data = [{
        name: this.cliente.cliente.nombre + ' ' + this.cliente.cliente.apellidoPaterno + ' ' + this.cliente.cliente.apellidoMaterno, 
        address: this.cliente.cliente.domicilio,
        phone: this.cliente.cliente.telefono,
        classification: this.cliente.cliente.clasificacion,
        loans:this.cliente.credito?.monto ,
        date: dayjs(this.cliente.credito?.fechaEntrega).format('DD/MM/YYYY'),
        week: this.cliente.pagos?.[0]?.numeroSemana,
        weeklyAmount: this.cliente.pagos?.[0]?.cantidad,
        compliance: ''
      }]; 

    }  
  }
}
 