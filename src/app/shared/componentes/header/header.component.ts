import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  username!: string;
  showLogoutModal: boolean = false;

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit() {
    if (this.authService.isAunthenticated()) {
      this.username = this.authService.getUserFromToken();
    }
  }

  //Mostrar el modald e confirmacion de cierre de sesion
  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  confirmLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showLogoutModal = false;
  }

  //Cancelar y ocultar el modal
  cancelLogoutModal(): void {
    this.showLogoutModal = false;
  }
}
