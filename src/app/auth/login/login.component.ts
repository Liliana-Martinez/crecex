import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup; 
  
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''] 
    });
  }

  redirectToHome() {
    this.router.navigate(['/app/home']);
  }
}
