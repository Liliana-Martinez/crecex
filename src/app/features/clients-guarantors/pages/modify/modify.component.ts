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

  //Este @ViewChild es para hacer una referencia al formulario y asi acceder a hasUnsavedChanges()
  @ViewChild(ClientFormComponent)
    clientFormComponent?: ClientFormComponent;

  @ViewChild(GuarantorFormComponent)
    primaryGuarantorForm?: GuarantorFormComponent;
  
  @ViewChild(GuarantorFormComponent)
    secondaryGuarantorForm?: GuarantorFormComponent;
  

  modulo: string = 'update';
  selectedForm: string = 'client';
  client?: any; //Es el cliente buscado
  pendingClient: any = null;
  pendingForm: string | null = null;
  showUnsavedChangesModal = false;

  //Detectar si hay cambios en los formularios, se accede a través de las referencias con viewChild
  private hasUnsavedChanges(): boolean {
    if (this.selectedForm === 'client') {
      return this.clientFormComponent?.hasUnsavedChanges() ?? false;
    }
    if (this.selectedForm === 'primaryGuarantor') {
      return this.primaryGuarantorForm?.hasUnsavedChanges() ?? false;
    }
    if (this.selectedForm === 'secondaryGuarantor') {
      return this.secondaryGuarantorForm?.hasUnsavedChanges() ?? false;
    }
    return false;
  }

  onClientFound(client: any): void {

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
  }

  onFormChange(newForm: string): void {

    const hasChanges =this.hasUnsavedChanges();

    if (hasChanges) {
      this.pendingForm = newForm; //Guarda temporalemnte el otro aval al que queria editar
      console.log('pendingForm: ', this.pendingForm);
      this.showUnsavedChangesModal = true;
      return;
    }
    this.selectedForm = newForm;
  }

  cancelUnsavedChanges(): void {
    this.pendingClient = null;
    this.pendingForm = null;
    this.showUnsavedChangesModal = false;
  }

  discardUnsavedChanges(): void {

    this.showUnsavedChangesModal = false;

    if (this.pendingClient) {
      this.client = this.pendingClient;
    } else if (this.pendingForm) {
      this.selectedForm = this.pendingForm;
    } else {
      this.client = null;
    }

    this.pendingClient = null;
    this.pendingForm = null;
  }
}

