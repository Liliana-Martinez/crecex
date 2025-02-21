import { Component } from '@angular/core';
import { SubmenuComponent } from './components/submenu/submenu.component';
import { ClientFormComponent } from './components/client-form/client-form.component';


@Component({
  selector: 'app-clients-guarantors',
  imports: [SubmenuComponent, ClientFormComponent],
  templateUrl: './clients-guarantors.component.html',
  styleUrl: './clients-guarantors.component.css'
})
export class ClientsGuarantorsComponent {

}
