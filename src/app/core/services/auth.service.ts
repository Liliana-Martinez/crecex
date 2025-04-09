import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../../models/Auth';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';
import { RegisterRequest } from '../../models/RegisterRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  //Iniciar sesion
  login(credentials: Auth): Observable<Auth> {
    return this.http.post<Auth>(API_ROUTES.AUTH.LOGIN, credentials);
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

  //Eliminar token (Cerrar sesion)
  logout(): void {
    localStorage.removeItem('token');
  }

  //Verificar si el usuario esta autenticado
  isAunthenticated(): boolean {
    return !!this.getToken();
  }
}
