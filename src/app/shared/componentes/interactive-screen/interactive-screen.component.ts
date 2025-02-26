import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-interactive-screen',
  imports: [RouterOutlet,HeaderComponent, MenuComponent],
  templateUrl: './interactive-screen.component.html',
  styleUrl: './interactive-screen.component.css'
})
export class InteractiveScreenComponent {

}
