import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sing-in',
  imports: [RouterLink, RouterModule],
  templateUrl: './sing-in.component.html',
  styleUrls: ['./sing-in.component.css']
})
export class SingInComponent { 
  constructor(private router: Router) {}

  redirectToLogin() {
    this.router.navigate(['/']); // Redirige al login
  }
}

