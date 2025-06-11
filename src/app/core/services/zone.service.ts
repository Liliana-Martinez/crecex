import { Injectable } from '@angular/core';
import { Zone } from '../../models/Zone';
import { API_ROUTES } from '../constants/api-routes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private http:HttpClient) { }

  getZones(): Observable<Zone[]> { 
      return this.http.get<Zone[]>(API_ROUTES.ZONES.GETALL);
    }
  
  zoneData(idZona: number): Observable<any>{
  return this.http.get<any>(`${API_ROUTES.PAYMENTS}?idZona=${idZona}`);
  } 
}
