import { Component } from '@angular/core';
import { SubmenuuComponent } from '../../componentss/submenuu/submenuu.component';
import { TableComponent } from '../../componentss/table/table.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../../../shared/componentes/search-bar/search-bar.component';

@Component({
  selector: 'app-renew',
  imports: [SubmenuuComponent,TableComponent,CommonModule, SearchBarComponent],
  templateUrl: './renew.component.html',
  styleUrl: './renew.component.css'
})
export class RenewComponent {

}
 