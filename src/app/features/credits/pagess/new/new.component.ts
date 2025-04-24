import { Component, OnInit } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../componentss/table/table.component';
import { CreditsService } from '../../../../core/services/credits.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  standalone: true,
  imports: [
    SubmenuuComponent,
    SearchBarComponent,
    FormCreditComponent,
    SaveButtonComponent,
    PrintButtonComponent,
    CommonModule,
    MatTableModule, 
    TableComponent
  ] 
})
export class NewComponent {
  modulo: string = 'new';
  cliente: any = null;
  formulario: any = null;

  constructor(private creditsService: CreditsService) {}

  // Recibe al cliente desde search-bar
  mostrarClienteEnTabla(cliente: any): void {
    this.cliente = cliente;
  }

  // Recibe los datos del formulario desde form-credit
  guardarFormulario(formulario: any): void {
    this.formulario = formulario;
    console.log('Formulario recibido:', this.formulario);
  }

  // Enviar al backend
  enviarFormulario(): void {
    if (!this.formulario) {
      console.error('No hay formulario para enviar');
      return;
    }

    this.creditsService.enviarFormulario(this.modulo, this.formulario).subscribe({
      next: (response) => {
        console.log('Formulario enviado con éxito:', response);
        // Aquí podrías limpiar los datos o mostrar una notificación
      },
      error: (error) => {
        console.error('Error al enviar el formulario:', error);
      }
    });
  }
}

