import { Component } from '@angular/core';
import { SubmenuuComponent } from './componentss/submenuu/submenuu.component';
import { TableComponent } from './componentss/table/table.component';
import { FormCreditComponent } from './componentss/form-credit/form-credit.component';
@Component({
  selector: 'app-credits',
  imports: [SubmenuuComponent, TableComponent, FormCreditComponent],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.css'
})
export class CreditsComponent {  

}
  