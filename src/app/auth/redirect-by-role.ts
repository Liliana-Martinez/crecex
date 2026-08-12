import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-redirect-by-role',
  template: ''
})

export class RedirectByRoleComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {

    const role = this.authService.getUserType();
    const defaultRoute = this.route.snapshot.data['defaultRoute'];
    const currentModule = this.router.url.split('/')[2];

    console.log('Rol:', role);
    console.log('Módulo:', currentModule);
    console.log('Ruta por defecto:', defaultRoute);

    // Clientes y Avales es un caso especial
    if (currentModule === 'clients-guarantors') {

      switch (role) {
        case 'promotoras':
        case 'tienda':
        case 'supervisora1':
        case 'supervisora2':
        case 'supervisora3':
          this.router.navigate(['/app/clients-guarantors/consult']);
          break;

        case 'administracion1':
        case 'administracion2':
        case 'gerencia1':
        case 'gerencia2':
          this.router.navigate(['/app/clients-guarantors/add']);
          break;

        default:
          this.router.navigate(['/app/home']);
          break;
      }

    } else {

      // Para todos los demás módulos
      this.router.navigate([
        '/app',
        currentModule,
        defaultRoute
      ]);

    }
  }
}