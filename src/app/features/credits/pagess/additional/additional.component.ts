import { Component } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { TableComponent } from '../../componentss/table/table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-additional',
  imports: [SubmenuuComponent, FormCreditComponent, TableComponent, CommonModule],
  templateUrl: './additional.component.html',
  styleUrl: './additional.component.css'
})
export class AdditionalComponent {

}
