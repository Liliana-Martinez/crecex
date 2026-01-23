import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';


@Component({
  selector: 'app-menu',
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {


  activeMenu: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(){
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        if (url.startsWith('/app/clients-guarantors')){
          this.activeMenu = 'clients';
        } else if (url.startsWith('/app/credits')){
          this.activeMenu = 'credits';
        } else if(url.startsWith('/app/statistics')){
          this.activeMenu = 'statistics';
        } else if (url.startsWith('/app/zones')){
          this.activeMenu = 'zones';
        } else {
          this.activeMenu = null;
        }
        console.log('Menu activo: ', this.activeMenu);
      });
  }
  
}
