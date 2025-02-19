import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InteractiveScreenComponent } from './shared/componentes/interactive-screen/interactive-screen.component';
import { HeaderComponent } from './shared/componentes/header/header.component';
import { MenuComponent } from './shared/componentes/menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MenuComponent, InteractiveScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crecex';
}
