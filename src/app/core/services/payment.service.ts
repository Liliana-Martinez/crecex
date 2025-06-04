import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';
import { BuscarCliente } from '../../models/BuscarCliente';
@Injectable({
  providedIn: 'root'
}) 
export class PaymentService {
  private apiUrl = 'TU_API_URL_AQUI'; // Cambia por la URL de tu backend

  constructor(private http: HttpClient) {}

  enviarPagos(pagos: any[]): Observable<any> {
    return this.http.post<any>(API_ROUTES.PAYMENTS, pagos);
  }
}