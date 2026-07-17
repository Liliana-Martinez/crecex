import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-redirect-by-role',
  template: ''
})

export class RedirectByRoleComponent implements OnInit {

    constructor (private router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        const role = this.authService.getUserType();
        console.log('Usuario dentro del sistema: ', role);

        // Las siguientes son las rutas a las que redirige aut. despues de home
        switch(role) {
            case 'promotoras':
                this.router.navigate(['/app/clients-guarantors/consult']);
                break;
            case 'tienda':
                this.router.navigate(['/app/clients-guarantors/consult']);
                break;
            case 'supervisora1':
                this.router.navigate(['/app/clients-guarantors/consult'])
                break;
            case 'supervisora2':
                this.router.navigate(['/app/clients-guarantors/consult']);
                break;
            case 'supervisora3':
                this.router.navigate(['/app/clients-guarantors/consult'])
                break;
            case 'administracion1':
                this.router.navigate(['/app/clients-guarantors/add'])
                break;
            case 'administracion2':
                this.router.navigate(['/app/clients-guarantors/add']);
                break;
            case 'gerencia1':
                this.router.navigate(['/app/clients-guarantors/add']);
                break;
            case 'gerencia2':
                this.router.navigate(['/app/clients-guarantors/add']);
                break;
            default:
                this.router.navigate(['app/home']);
                break;
        }
    }
}