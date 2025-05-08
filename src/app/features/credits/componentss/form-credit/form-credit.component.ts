
import { MatTableModule } from '@angular/material/table';
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
import { CreditsService } from '../../../../core/services/credits.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-credit',
  imports: [MatTableModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form-credit.component.html',
  styleUrl: './form-credit.component.css' 
})

export class FormCreditComponent {
  @Input() cliente: ClienteConDatos | null = null;
  idCliente: number | null = null;

  FormCredit: FormGroup;
  errorMensaje: string | null = null; 

  constructor(private fb: FormBuilder, private creditsService: CreditsService) {
    this.FormCredit = this.fb.group({
      monto: [null, Validators.required],
      semanas: [null, Validators.required],
      horarioEntrega: [null, Validators.required],
      atrasos: [null],
      modulo: 'new',
      recargos: [null],
      abonoSemanal: [{ value: null, disabled: true }],
      efectivo: [{ value: null, disabled: true }]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cliente'] && this.cliente) {
      this.idCliente = this.cliente.cliente.idCliente;
      console.log('ID del cliente:', this.idCliente);
    }
  }

  addCredit() {
    this.errorMensaje = null; 

    if (!this.FormCredit.valid) {
      this.errorMensaje = 'Completa los campos requeridos';
      return;
    }

    if (!this.idCliente) {
      this.errorMensaje = 'Elige un cliente antes de guardar el formulario';
      return;
    }

    const formData = {
      idCliente: this.idCliente,
      ...this.FormCredit.value
    };

    console.log('Datos enviados al servicio:', formData);

    this.creditsService.enviarFormulario('new', formData).subscribe(
      response => {
        console.log('Formulario enviado correctamente:', response);

        this.FormCredit.get('abonoSemanal')?.setValue(response.abonoSemanal);
        this.FormCredit.get('efectivo')?.setValue(response.efectivo);
      },
      error => {
        console.error('Error desde el Backendd: ', error);
        if(error.error && error.error.message){
          this.errorMensaje = error.error.message;
        }
        else{
          this.errorMensaje = 'Ocurrio un error inesperado'
        }

      }
    );
  }
}
