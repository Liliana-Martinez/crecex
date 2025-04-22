import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes'; 

@Injectable({
  providedIn: 'root'
})
export class CreditsService {
  constructor(private http: HttpClient) {}

  obtenerDatosCliente(nombreCompleto: string): Observable<any> {
    return this.http.post<any>(API_ROUTES.CREDITS.BUSCAR_CLIENTE, { nombreCompleto });
  }
}

