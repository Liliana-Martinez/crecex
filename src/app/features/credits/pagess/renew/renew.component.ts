import { Component } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { TableComponent } from '../../componentss/table/table.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SaveButtonComponent } from "../../../../shared/componentes/save-button/save-button.component";
import { PrintButtonComponent } from "../../../../shared/componentes/print-button/print-button.component";
import { FormCreditComponent } from "../../componentss/form-credit/form-credit.component";
import { CreditsService } from '../../../../core/services/credits.service';
import { ClienteConDatos } from '../../../../models/ClienteConDatos';
@Component({
  selector: 'app-renew',
  imports: [SubmenuuComponent, 
    TableComponent, CommonModule, 
    SearchBarComponent,
    PrintButtonComponent, 
    FormCreditComponent],
  templateUrl: './renew.component.html',
  styleUrl: './renew.component.css'
})
export class RenewComponent { 
  modulo: string = 'renew';
  cliente: any = null;
   errorMessage: string = '';
  
   constructor(private creditsService: CreditsService) {}
 
   clienteEncontrado(cliente: ClienteConDatos) {
     console.log('Cliente encontrado', cliente);
     this.cliente = cliente; 
   }
}
  