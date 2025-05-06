import { MatTableModule } from '@angular/material/table';
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';

@Component({
  selector: 'app-form-credit',
  imports: [MatTableModule, FormsModule],
  templateUrl: './form-credit.component.html',
  styleUrl: './form-credit.component.css' 
})
export class FormCreditComponent {
 @Input() cliente:ClienteConDatos | null = null
 idCliente: number | null = null;
  
 ngOnChanges(changes: SimpleChanges) {
  if (changes['cliente'] && this.cliente) {
    this.idCliente = this.cliente.cliente.idCliente;
    console.log('ID del cliente:', this.idCliente);
  }
}
}   