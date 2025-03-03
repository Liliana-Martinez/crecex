import { Component } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { TableComponent } from '../../componentss/table/table.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SaveButtonComponent } from "../../../../shared/componentes/save-button/save-button.component";
import { PrintButtonComponent } from "../../../../shared/componentes/print-button/print-button.component";

@Component({
  selector: 'app-new',
  imports: [SubmenuuComponent, FormCreditComponent, TableComponent, CommonModule, SearchBarComponent, SaveButtonComponent, PrintButtonComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {
  
   
}
 