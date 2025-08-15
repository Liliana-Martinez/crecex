import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';
@Injectable({
  providedIn: 'root'
}) 
export class CommissionsService {

  constructor(private http: HttpClient) { }

  getCommissionsByZone(idZona: number): Observable<any> {
    // Llamada GET al backend enviando el idZona como query param
    return this.http.get(`${API_ROUTES.COMMISSIONS}?idZona=${idZona}`);
  }

}
