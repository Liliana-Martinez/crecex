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

        // Las siguientes son las rutas a las que redirige aut. despues de home
        switch(role) {
            case 'usuario1':
                this.router.navigate(['app/clients-guarantors/consult']);
                break;
            case 'usuario2':
                this.router.navigate(['app/clients-guarantors/consult']);
                break;
            case 'usuario3':
                this.router.navigate(['app/clients-guarantors/add']);
                break;
            case 'administrador':
                this.router.navigate(['app/clients-guarantors/add']);
                break;
            default:
                this.router.navigate(['app/home']);
                break;
        }
    }
}