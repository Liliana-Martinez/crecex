import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) {}

  updateCredit(body: {idCredito: number;monto: number;semanas: number;}): Observable<any> {
    return this.http.put(API_ROUTES.ADMINISTRATION.UPDATE_CREDIT,body);
  }

  cancelCredit(idCredito: number): Observable<any> {
    return this.http.put(API_ROUTES.ADMINISTRATION.CANCEL_CREDIT,{ idCredito });
  }
  deletePayment(idPago: number): Observable<any> {
    return this.http.delete(`${API_ROUTES.ADMINISTRATION.DELETE_PAYMENT}/${idPago}`);
  }
  ejecutarAtrasos(): Observable<any> {
    return this.http.post(API_ROUTES.ADMINISTRATION.PROCESS.ATRASOS,{});
  }
  ejecutarAdelantos(): Observable<any> {
    return this.http.post(API_ROUTES.ADMINISTRATION.PROCESS.ADELANTOS,{});
  }
  ejecutarFalla(): Observable<any> {
    return this.http.post(API_ROUTES.ADMINISTRATION.PROCESS.FALLA,{});
  }
}