import { Component } from '@angular/core';
import { SubmenuComponent } from '../../components/submenu/submenu.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { FormsModule } from '@angular/forms';
import { GuarantorFormComponent } from '../../components/guarantor-form/guarantor-form.component';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
 
  
=======
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';


>>>>>>> 0938181 (Actualizacion en consultar cliente)
@Component({
  selector: 'app-add',
  imports: [SubmenuComponent, ClientFormComponent, FormsModule, GuarantorFormComponent, CommonModule, SaveButtonComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  selectedForm: string = 'client';

  changeForm(event: any) {
    console.log("Seleccionado:", this.selectedForm);
  }
}
