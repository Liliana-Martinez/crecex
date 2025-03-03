import { Component } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { FormCreditComponent } from '../../componentss/form-credit/form-credit.component';
import { TableComponent } from '../../componentss/table/table.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar-client/search-bar.component';

@Component({
  selector: 'app-additional',
  imports: [SubmenuuComponent, FormCreditComponent, TableComponent, CommonModule, SearchBarComponent],
  templateUrl: './additional.component.html',
  styleUrl: './additional.component.css'
})
export class AdditionalComponent {

}
