import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';
@Injectable({
  providedIn: 'root'
}) 
export class PaymentService {
  constructor(private http: HttpClient) {}

  enviarPagos(pagos: any[]): Observable<any> {
    return this.http.post<any>(API_ROUTES.PAYMENTS , pagos);
  }
} 