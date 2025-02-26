import { Component } from '@angular/core';
import { SubmenuComponent } from './components/submenu/submenu.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
//import { InteractiveScreenComponent } from '../../shared/componentes/interactive-screen/interactive-screen.component';


@Component({
  selector: 'app-clients-guarantors',
  imports: [SubmenuComponent, ClientFormComponent/*, InteractiveScreenComponent*/],
  templateUrl: './clients-guarantors.component.html',
  styleUrl: './clients-guarantors.component.css'
})
export class ClientsGuarantorsComponent {

}
