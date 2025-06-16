import { Component } from '@angular/core';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SubmenuComponent } from '../../components/submenu/submenu.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { GuarantorFormComponent } from '../../components/guarantor-form/guarantor-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-modify',
  standalone: true,
  imports:
   [SubmenuComponent, SearchBarComponent, ClientFormComponent, GuarantorFormComponent, FormsModule, CommonModule],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.css'
})

export class ModifyComponent {
  modulo: string = 'modify';
  selected: string = 'client';
  client?: any; //Es el cliente buscado

  onClienteEncontrado(client: any): void {
    this.client = client;
  }
}

