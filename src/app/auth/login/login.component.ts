import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  //Se crea el formGroup de tipo Auth
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  
  /*Se capturan los valores de los inputs*/
  ngOnInit() {
    this.loginForm = new FormGroup({
      user: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

    login() {
      if (this.loginForm.invalid) {
        this.errorMessage = 'Por favor, complete todos los campos.';
        return;
      }
  
      //Llamar al servicio de autenticacion
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Respuesta del backend: ', response);
          this.authService.saveToken(response.succesfull);
          this.router.navigate(['/app/home']);
        },
        error: (err) => {
          console.error('Error en el login', err);
          this.errorMessage = 'Error: usuario o contraseña incorrectos.';
        }
      });
    }
}
