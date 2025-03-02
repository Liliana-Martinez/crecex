import { Component } from '@angular/core';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SubmenuComponent } from '../../components/submenu/submenu.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { GuarantorFormComponent } from '../../components/guarantor-form/guarantor-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SaveButtonComponent } from '../../../../shared/componentes/save-button/save-button.component';

@Component({
  selector: 'app-modify',
  imports:
   [SubmenuComponent, SearchBarComponent, ClientFormComponent, GuarantorFormComponent, FormsModule, CommonModule, SaveButtonComponent],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.css'
})
export class ModifyComponent {
  selected: string = 'client';

  changeForm(event: any) {
    console.log("Seleccionado:", this.selected);
  }
}
