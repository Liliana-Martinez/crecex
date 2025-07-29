import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/componentes/header/header.component';
import { MenuComponent } from '../../shared/componentes/menu/menu.component';
import { AccessService } from '../../core/services/access.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showModal: boolean = false;

  constructor (private accessService: AccessService) {}

  ngOnInit(): void {
      this.accessService.accessDenied$.subscribe((value) => {
        if (value) {
          this.showModal = true;

          //Limpiar para futuras navegaciones
          setTimeout(() => this.accessService.clearAccessDeniedFlag(), 100); 
        }
      });
  }

  closeModal() {
    this.showModal = false;
  }
}
