import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  //Se crea el formGroup de tipo Auth
  auth!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}
  
  //Se capturan los valores de los inputs
  ngOnInit() {
    this.auth = new FormGroup({
      user: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  login() {
    if(this.auth.valid) {
      const credentials = this.auth.value;

      this.authService.login(credentials).subscribe(response => {
        if(response.success) {
          //Redirigir a home si el login es correcto
          this.router.navigate(['/app/home']);
        } else {
          alert("Credenciales incorrectas")
        }
      })
    }
  }
}
