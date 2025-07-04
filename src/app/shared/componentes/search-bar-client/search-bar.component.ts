import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreditsService } from '../../../core/services/credits.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { MatInputModule } from '@angular/material/input';  
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { BuscarCliente } from '../../../models/BuscarCliente';

@Component({
  selector: 'app-search-bar', 
  standalone: true,
  templateUrl: './search-bar.component.html',
  imports: [
    CommonModule,
    FormsModule,  
    MatInputModule,  
    MatFormFieldModule,  
  ],
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent {
  @Input() modulo: string = '';
  @Input() selectedOption: string = ''; //************ 
  @Output() clienteEncontrado = new EventEmitter<any>(); //Dentro de <> estaba ClienteConDatos
  nombreCompleto: string = '';  
  mensajeError: string = '';
  
  constructor(private creditsService: CreditsService) {}

  buscarCliente(): void {
    this.mensajeError = '';

    if (!this.nombreCompleto.trim()) {
      this.mensajeError = 'El nombre completo es obligatorio';
      return;
    }   
      
    const datosCliente: BuscarCliente = {
      nombreCompleto: this.nombreCompleto, 
      modulo: this.modulo,
      selectedOption: this.selectedOption
    };

    console.log('Datos que se van a enviar del buscador: ',datosCliente);

    this.creditsService.obtenerDatosCliente(datosCliente).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.clienteEncontrado.emit(response);
      },
      error: (err) => {
        if (err.status === 404) {
          this.mensajeError = 'Cliente no encontrado.';
        } else {
          this.mensajeError = err.error?.message || 'Ocurrio un error inesperado';
        }
      }
    });
  }
} 