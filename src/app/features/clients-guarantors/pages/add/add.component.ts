import { Component } from '@angular/core';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { FormsModule } from '@angular/forms';
import { GuarantorFormComponent } from '../../components/guarantor-form/guarantor-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add',
  imports: [ClientFormComponent, FormsModule, GuarantorFormComponent, CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  selectedForm: string = 'client';

  changeForm(event: any) {
    console.log("Seleccionado:", this.selectedForm);
  }
}
