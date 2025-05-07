import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreditsService } from '../../../core/services/credits.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { MatInputModule } from '@angular/material/input';  
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { BuscarCliente } from '../../../models/BuscarCliente';
import { ClienteConDatos } from '../../../models/ClienteConDatos';
@Component({
  selector: 'app-search-bar', 
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
  @Output() clienteEncontrado = new EventEmitter<ClienteConDatos>();
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
      modulo: this.modulo
    };

    this.creditsService.obtenerDatosCliente(datosCliente).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.clienteEncontrado.emit(response);  // Si el cliente fue encontrado, se emiten los datos
      },
      error: (err) => {
        this.mensajeError = err.message;  
      }
    });
  }
}