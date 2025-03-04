import { Component } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';
import { SaveButtonComponent } from "../../../../shared/componentes/save-button/save-button.component";
import { PrintButtonComponent } from "../../../../shared/componentes/print-button/print-button.component";
import { MatTableModule } from '@angular/material/table';
export interface NewCredit { 
  name: string;
  address: string;
  phone: string;
  classification: string;
}
const NEW_CREDIT_DATA: NewCredit[] = [
  {name: 'Claudia Yaneth Rafael', address: 'Manuel Avila # 22', phone: '3418780498', classification: 'A'},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-new',
  imports: [SubmenuuComponent, FormCreditComponent, CommonModule, SearchBarComponent, SaveButtonComponent, PrintButtonComponent, MatTableModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent {
  newCreditCol: string[] = ['name', 'address', 'phone', 'classification'];
  dataNewCredit = NEW_CREDIT_DATA; 
}
 