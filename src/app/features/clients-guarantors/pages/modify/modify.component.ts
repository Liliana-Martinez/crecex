import { Component, ViewChild } from '@angular/core';
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

export class ModifyComponent {
  modulo: string = 'update';//Aqui era modify
  selectedForm: string = 'client';
  client?: any; //Es el cliente buscado
  pendingClient: any = null; 
  showUnsavedChangesModal = false;

  //Este @ViewChild es para hacer una referencia al formulario y asi acceder a hasUnsavedChanges()
  @ViewChild(ClientFormComponent)
    clientFormComponent?: ClientFormComponent;

  @ViewChild(GuarantorFormComponent)
    primaryGuarantorForm?: GuarantorFormComponent;
  
  @ViewChild(GuarantorFormComponent)
    secondaryGuarantorForm?: GuarantorFormComponent;

  private hasUnsavedChanges(): boolean {
    if (this.selectedForm === 'client') {
      console.log('formulario del cliente');
      return this.clientFormComponent?.hasUnsavedChanges() ?? false;
    }
    if (this.selectedForm === 'primaryGuarantor') {
      console.log('formulario del aval principal');
      return this.primaryGuarantorForm?.hasUnsavedChanges() ?? false;
    }
    if (this.selectedForm === 'secondaryGuarantor') {
      console.log('formulario del aval secundario');
      return this.secondaryGuarantorForm?.hasUnsavedChanges() ?? false;
    }
    return false;
  }

  onClienteEncontrado(client: any): void {

    const hasChanges = this.hasUnsavedChanges();

    if (hasChanges) {
      this.pendingClient = client;
      this.showUnsavedChangesModal = true;
      return;
    }
    this.client = client;
  }

  onClientNotFound(): void{
    const hasChanges = this.hasUnsavedChanges();

    if (hasChanges) {
      this.showUnsavedChangesModal = true;
      this.pendingClient = null;
      console.log('dentro del if')
      return;
    }
    this.client = null;
    console.log('this client: ', this.client);
  }

  cancelUnsavedChanges(): void {
    this.pendingClient = null;
    this.showUnsavedChangesModal = false;
  }

  discardUnsavedChanges(): void {
    this.showUnsavedChangesModal = false;

    if (this.pendingClient) {
      this.client = this.pendingClient;
    } else {
      this.client = null;
    }
    this.pendingClient = null;
  }
}

