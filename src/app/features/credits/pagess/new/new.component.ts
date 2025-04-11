import { Component, OnInit } from '@angular/core';
import { CreditsService } from '../../../../core/services/credits.service';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

export interface NewCredit {
  name: string;
  address: string;
  phone: string;
  classification: string;
}

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
    MatTableModule
  ]
})
export class NewComponent implements OnInit {
  newCreditCol: string[] = ['name', 'address', 'phone', 'classification'];
  dataNewCredit: NewCredit[] = [];
  notFoundMessage = '';

  constructor(private creditsService: CreditsService) {}

  ngOnInit(): void {}

  onSearch(nombreCompleto: string): void {
    console.log('Buscando cliente con nombre:', nombreCompleto); // Verificar si el nombre es correcto
    this.creditsService.buscarCliente(nombreCompleto).subscribe({
      next: (data: any) => {
        // Lógica de manejo de respuesta
      },
      error: (err) => {
        if (err.status === 404) {
          this.dataNewCredit = [];
          this.notFoundMessage = 'Cliente no encontrado';
        } else {
          this.notFoundMessage = 'Error al consultar el cliente';
        }
      }
    });
  }
}

