
import { MatTableModule } from '@angular/material/table';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
import { CreditsService } from '../../../../core/services/credits.service';
import { CommonModule } from '@angular/common';
import { SaveButtonComponent } from "../../../../shared/componentes/save-button/save-button.component";

@Component({
  selector: 'app-form-credit',
  imports: [MatTableModule, FormsModule, ReactiveFormsModule, CommonModule, SaveButtonComponent],
  templateUrl: './form-credit.component.html',
  styleUrl: './form-credit.component.css' 
})

export class FormCreditComponent implements OnChanges {
  @Input() cliente: ClienteConDatos | null = null;
  @Output() response= new EventEmitter<any>();
  @Input() modulo: 'new' | 'renew' | 'additional' = 'new'; // Recibe el módulo actual
  selectedOptionn: string = "12"
  selectedOption: string = "mañana"
  idCliente: number | null = null;

  FormCredit: FormGroup;
  errorMensaje: string | null = null;
  errorMensaj: string |  null = null;
  
  modalVisible = false;
  datosParaConfirmar: any = null;

  constructor(private fb: FormBuilder, private creditsService: CreditsService) {
    this.FormCredit = this.fb.group({
      monto: [null, Validators.required],
      semanas: [null, Validators.required],
      horarioEntrega: [null, Validators.required],
      atrasos: [null],
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
  abrirConfirmacion(): void {
  this.errorMensaje = null;

  if (!this.FormCredit.valid) {
    this.errorMensaje = 'Completa los campos obligatorios';
    return;
  }

  if (!this.idCliente) {
    this.errorMensaje = 'Elige un cliente antes de guardar el formulario';
    return;
  }

  const valores = this.FormCredit.getRawValue();
  const monto = Number(valores.monto);
  const semanas = Number(valores.semanas);
  const atrasos = Number(valores.atrasos) || 0;
  const recargos = Number(valores.recargos) || 0;

  let efectivo = Math.round(monto - atrasos - recargos);

  
  const factor = semanas === 12 ? 1.5 : 1.583;
  const abonoSemanal = Math.round((monto * factor) / semanas);

  let semanasRestantes = 0;
  let descuentoSemanasPendientes = 0;
  let semanasPagadas = 0;


  if (this.modulo === 'renew' && this.cliente?.credito) {
    const semanasTotales = this.cliente.credito.semanas;
    const abonoSemanalAnterior = this.cliente.credito.abonoSemanal;

    // Obtener las semanas pagadas desde los pagos
    const pagosRealizados = this.cliente.pagos || []; 
    if (pagosRealizados.length > 0) {
      semanasPagadas = pagosRealizados.reduce((maxSemana, pago) => Math.max(maxSemana, pago.numeroSemana), 0);
    }
    semanasRestantes = semanasTotales - semanasPagadas;
    if (semanasRestantes > 0) {
      descuentoSemanasPendientes = semanasRestantes * abonoSemanalAnterior;
      efectivo -= descuentoSemanasPendientes;
    }
  }
  this.datosParaConfirmar = {
    ...valores,
    efectivo,
    abonoSemanal,
    semanasRestantes,
    descuentoSemanasPendientes
  };
  this.modalVisible = true;
  }
  confirmarEnvio(): void {
    const formData = {
      idCliente: this.idCliente,
      ...this.FormCredit.value,
      modulo: this.modulo 
    };

    console.log('Formulario enviado al backend:', formData);

    this.creditsService.enviarFormulario(this.modulo, formData).subscribe(
      response => {
        console.log('Formulario enviado correctamente:', response);
        this.FormCredit.get('abonoSemanal')?.setValue(response.abonoSemanal);
        this.FormCredit.get('efectivo')?.setValue(response.efectivo);
        this.modalVisible = false;
        this.errorMensaj = 'Crédito creado satisfactoriamente';
        this.response.emit({
        ...response,
        nombreCliente: this.cliente?.cliente?.nombre ?? '',
        credito: this.cliente?.credito ?? null,
        pagos: this.cliente?.pagos ?? []
        });
      },
      error => {
        console.error('Error desde el Backend: ', error);
        this.errorMensaje = error.error?.message || 'Ocurrió un error inesperado';
        this.modalVisible = false;
      }
    );
  }
}


