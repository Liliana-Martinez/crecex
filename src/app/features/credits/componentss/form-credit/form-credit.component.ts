
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
  @Input() modulo: 'new' | 'renew' | 'additional' = 'new'; // Recibe el módulo actual

  idCliente: number | null = null;

  FormCredit: FormGroup;
  errorMensaje: string | null = null;

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
    this.errorMensaje = 'Completa los campos requeridos';
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

  // Cálculo de abonoSemanal
  const factor = semanas === 12 ? 1.5 : 1.583;
  const abonoSemanal = Math.round((monto * factor) / semanas);

  // Variables para las semanas restantes y el descuento
  let semanasRestantes = 0;
  let descuentoSemanasPendientes = 0;
  let semanasPagadas = 0;

  // Lógica especial si es módulo 'renew' (renovación)
  if (this.modulo === 'renew' && this.cliente?.credito) {
    const semanasTotales = this.cliente.credito.semanas;
    const abonoSemanalAnterior = this.cliente.credito.abonoSemanal;

    // Obtener las semanas pagadas desde los pagos
    const pagosRealizados = this.cliente.pagos || []; // Asegúrate de que 'pagos' contiene los pagos
    if (pagosRealizados.length > 0) {
      // Obtener la última semana pagada (numeroSemana más alta)
      semanasPagadas = pagosRealizados.reduce((maxSemana, pago) => Math.max(maxSemana, pago.numeroSemana), 0);
    }

    // Calcular las semanas restantes
    semanasRestantes = semanasTotales - semanasPagadas;

    // Si hay semanas restantes, calcular el descuento
    if (semanasRestantes > 0) {
      descuentoSemanasPendientes = semanasRestantes * abonoSemanalAnterior;
      // Descontar las semanas restantes al efectivo
      efectivo -= descuentoSemanasPendientes;
    }
  }

  // Guardamos todos los datos para confirmar en el modal
  this.datosParaConfirmar = {
    ...valores,
    efectivo,
    abonoSemanal,
    semanasRestantes,
    descuentoSemanasPendientes
  };

  // Mostrar el modal
  this.modalVisible = true;
}



  

  confirmarEnvio(): void {
    const formData = {
      idCliente: this.idCliente,
      ...this.FormCredit.value,
      modulo: this.modulo // <<--- Se incluye en el body
    };

    console.log('Formulario enviado al backend:', formData);

    this.creditsService.enviarFormulario(this.modulo, formData).subscribe(
      response => {
        console.log('Formulario enviado correctamente:', response);
        this.FormCredit.get('abonoSemanal')?.setValue(response.abonoSemanal);
        this.FormCredit.get('efectivo')?.setValue(response.efectivo);
        this.modalVisible = false;
      },
      error => {
        console.error('Error desde el Backend: ', error);
        this.errorMensaje = error.error?.message || 'Ocurrió un error inesperado';
        this.modalVisible = false;
      }
    );
  }
}


