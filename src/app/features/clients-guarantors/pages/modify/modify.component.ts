import { Component, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { GuarantorFormComponent } from '../../components/guarantor-form/guarantor-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-modify',
  standalone: true,
  imports: [SearchBarComponent, ClientFormComponent, GuarantorFormComponent, FormsModule, CommonModule],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.css'
})

export class ModifyComponent implements OnInit {
  modulo: string = 'update';//Aqui era modify
  selectedForm: string = 'client';
  client?: any; //Es el cliente buscado
  
  ngOnInit(): void {
    console.log('DENTRO DEL COMPONENTE MODIFY');
  }

  onClienteEncontrado(client: any): void {
    this.client = client;
  }
}

