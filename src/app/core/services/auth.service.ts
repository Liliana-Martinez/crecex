import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../../models/Auth';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';
import { RegisterRequest } from '../../models/RegisterRequest';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '../../models/AuthResponse';

interface TokenPayload {
  userId: number;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) {}

  //Iniciar sesion
  login(credentials: Auth): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
  }

  //Registro de usuario
  register(credentials: RegisterRequest): Observable<RegisterRequest> {
    return this.http.post<RegisterRequest>(API_ROUTES.AUTH.REGISTER, credentials);
  }

  //Guardar token en el almacenamiento local
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  //Obtener el token de almacenamiento
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserFromToken(): string {
    const token = this.getToken();
    if (!token || token.split('.').length !== 3) return '';

    const decoded = jwtDecode<TokenPayload>(token);
    console.log('Decoded:', decoded);
    return decoded.userName;
  }

  //Eliminar token (Cerrar sesion)
  logout(): void {
    localStorage.removeItem('token');
  }

  //Verificar si el usuario esta autenticado
  isAunthenticated(): boolean {
    return !!this.getToken();
  }
}

