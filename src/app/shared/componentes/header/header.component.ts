import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  username!: string;

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit() {
    if (this.authService.isAunthenticated()) {
      this.username = this.authService.getUserFromToken();
    }
  }
}
