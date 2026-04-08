import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';
import { BuscarCliente } from '../../models/BuscarCliente';
@Injectable({
  providedIn: 'root'
}) 
export class CreditsService {
  constructor(private http: HttpClient) {}
 
  // Método para obtener los datos del cente
  obtenerDatosCliente(credentials: BuscarCliente): Observable<any> {
    return this.http.post<any>(API_ROUTES.SEARCHBARCLIENTE.SEARCH, credentials);
  }
 
  enviarFormulario(modulo: string, formData: any ): Observable<any> {
    let url = '';
    switch (modulo) {
      case 'new':
        url = API_ROUTES.CREDITS.CREATE_NEW;
        break; 
      case 'renew':
        url = API_ROUTES.CREDITS.RENEW;
        break;
      case 'additional':
        url = API_ROUTES.CREDITS.CREATE_ADDITIONAL;
        break;
      default:
        url = API_ROUTES.CREDITS.CREATE_NEW;
    }

    return this.http.post<any>(url, formData);
  } 
}
  