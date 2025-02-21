import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/componentes/header/header.component';
import { MenuComponent } from '../../shared/componentes/menu/menu.component';
import { InteractiveScreenComponent } from '../../shared/componentes/interactive-screen/interactive-screen.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MenuComponent, InteractiveScreenComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
