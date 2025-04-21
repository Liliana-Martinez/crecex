import { Component } from '@angular/core';
import { CreditsService } from '../../../core/services/credits.service';
import { MatFormField } from '@angular/material/form-field'; // Esto sigue aquí si es necesario, aunque no es obligatorio en la mayoría de casos
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [MatInputModule, MatFormField, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';

  constructor(private creditsService: CreditsService) {}

  onSearchSubmit(): void {
    console.log('Buscando:', this.nombre, this.apellidoPaterno, this.apellidoMaterno);

    this.creditsService
      .obtenerDatosCliente(this.nombre, this.apellidoPaterno, this.apellidoMaterno)
      .subscribe(cliente => {
        console.log('Cliente encontrado:', cliente);
        // Aquí puedes emitir el cliente a form-credit o cargarlo en un formulario
      });
  }
}
