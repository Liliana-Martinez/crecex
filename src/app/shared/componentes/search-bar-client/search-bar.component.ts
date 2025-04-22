import { Component } from '@angular/core';
import { CreditsService } from '../../../core/services/credits.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  
import { MatInputModule } from '@angular/material/input';  
import { MatFormFieldModule } from '@angular/material/form-field'; 

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  imports: [
    CommonModule,
    FormsModule,  
    MatInputModule,  
    MatFormFieldModule 
  ],
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  nombreCompleto: string = '';  

  constructor(private creditsService: CreditsService) {}

  buscarCliente(): void {
    console.log('Buscando cliente:', this.nombreCompleto);
    this.creditsService.obtenerDatosCliente(this.nombreCompleto)
      .subscribe((response) => {
        console.log('Cliente encontrado:', response.cliente);
        console.log('Datos de crédito:', response.credito);
        console.log('Pagos realizados:', response.pagos);
      });
  }
}

