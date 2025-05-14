import { Component, OnInit } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { PrintButtonComponent } from '../../../../shared/componentes/print-button/print-button.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../componentss/table/table.component';
import { CreditsService } from '../../../../core/services/credits.service';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  standalone: true,
  imports: [
    SubmenuuComponent,
    SearchBarComponent,
    FormCreditComponent,
    //SaveButtonComponent,
    PrintButtonComponent, 
    CommonModule,
    MatTableModule, 
    TableComponent
  ] 
})
export class NewComponent { 
  modulo: string = 'new'; 
  cliente: any = null;
  errorMessage: string = '';
 
  constructor(private creditsService: CreditsService) {}

  clienteEncontrado(cliente: ClienteConDatos) {
    console.log('Cliente encontrado', cliente);
    this.cliente = cliente; 
  }
  
  
  
}

 