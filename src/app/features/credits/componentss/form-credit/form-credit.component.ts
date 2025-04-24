import { MatTableModule } from '@angular/material/table';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-credit',
  imports: [MatTableModule],
  templateUrl: './form-credit.component.html',
  styleUrl: './form-credit.component.css'
})
export class FormCreditComponent {
  @Output() formularioCompleto = new EventEmitter<any>();

  formulario: any = {
    monto: 0,
    semanas: '',
    horario: '',
    atrasos: '',
    recargos: 0
  };
  submitFormulario(): void {
    this.formularioCompleto.emit(this.formulario);
  }
} 