import { Component } from '@angular/core';
import { SubmenuuuComponent } from '../../componentsss/submenuuu/submenuuu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total-credits',
  imports: [SubmenuuuComponent, CommonModule],
  templateUrl: './total-credits.component.html',
  styleUrl: './total-credits.component.css'
})
export class TotalCreditsComponent {
  selectedForm: string = 'client';

  changeForm(event: any) {
    console.log("Seleccionado:", this.selectedForm);
  }
}
