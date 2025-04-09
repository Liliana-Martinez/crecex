import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sing-in',
  imports: [RouterLink, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './sing-in.component.html',
  styleUrls: ['./sing-in.component.css']
})
export class SingInComponent implements OnInit { 

  registerForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
      this.registerForm = new FormGroup({
        user: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        repeatPassword: new FormControl('', [Validators.required])
      });
  }

  register(){
    const { user, password } = this.registerForm.value;

    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.repeatPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.authService.register({user, password}).subscribe({
      next: (response) => {
        console.log('Usuario registrado.', response);
        this.successMessage = 'Usuario registrado exitosamente.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error al registrar el usuario.', err);
        
        //Avisar si el usuario ya existe
        if (err.error && err.error.error === 'El usuario ya existe') {
          this.errorMessage = 'Este nombre de usuario ya está en uso.';
        } else {
          this.errorMessage = 'Error al registrar, intente de nuevo.'
        }
      }
    });
  }
}

/**Usuarios y contraseñas
 * 1. administrador -> admin123
 * 2. esmeralda -> esme1234
 * 3. liliana -> lili1234
 * 4. claudia -> claudia123
 */

