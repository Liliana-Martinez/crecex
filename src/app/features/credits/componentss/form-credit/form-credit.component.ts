import { MatTableModule } from '@angular/material/table';
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
import { CreditsService } from '../../../../core/services/credits.service';

@Component({
  selector: 'app-form-credit',
  imports: [MatTableModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-credit.component.html',
  styleUrl: './form-credit.component.css' 
})

export class FormCreditComponent {
  @Input() cliente: ClienteConDatos | null = null;
  idCliente: number | null = null;

  FormCredit: FormGroup;

  constructor(private fb: FormBuilder, private creditsService: CreditsService) {
    this.FormCredit = this.fb.group({
      monto: [null, Validators.required],
      semanas: [null, Validators.required],
      horarioEntrega: [null, Validators.required],  
      atrasos: [null],
      modulo: 'new',
      recargos: [null],
      abonoSemanal: [{ value: null, disabled: false }],  // asegúrate que esté aquí
      efectivo: [{ value: null, disabled: false }]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cliente'] && this.cliente) {
      this.idCliente = this.cliente.cliente.idCliente;
      console.log('ID del cliente:', this.idCliente);
    }
  }

  addCredit() {
    if (!this.FormCredit.valid || !this.idCliente) {
      console.warn('Formulario inválido o falta idCliente');
      return;
    }

    const formData = {
      idCliente: this.idCliente,
      ...this.FormCredit.value
    };

    console.log('Datos enviados al servicio:', formData);
    this.creditsService.enviarFormulario('new', formData).subscribe(
      response => {
        console.log('Frmulario enviado correctamente:', response);
        this.FormCredit.patchValue({
          abonoSemanal: response.abonoSemanal,
          efectivo: response.efectivo
        });
      },
      error => {
        console.error('Error al enviar el formulario:', error);
      }
    );
  }
}
