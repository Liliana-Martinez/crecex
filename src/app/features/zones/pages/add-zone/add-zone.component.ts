import { Component } from '@angular/core';
import { ZoneFormComponent } from '../../components/zone-form/zone-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-zone',
  imports: [ZoneFormComponent, CommonModule],
  templateUrl: './add-zone.component.html',
  styleUrl: './add-zone.component.css'
})
export class AddZoneComponent {

  selectedForm: string = 'zone';

  changeForm(event: any) {
    console.log("Seleccionado:", this.selectedForm);
  }
}
