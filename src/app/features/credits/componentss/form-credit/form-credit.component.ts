import { MatTableModule } from '@angular/material/table';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-form-credit',
  imports: [MatTableModule, FormsModule],
  templateUrl: './form-credit.component.html',
  styleUrl: './form-credit.component.css'
})
export class FormCreditComponent {
  @Output() formularioCompleto = new EventEmitter<any>();

  formulario: any = {
    monto: '',
    semanas: '',
    horarioEntrega: '',
    atrasos: '',
    recargos: ''
  };
  submitFormulario(): void {
    this.formularioCompleto.emit(this.formulario);
  } 
}  