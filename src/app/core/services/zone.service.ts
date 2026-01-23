import { Injectable } from '@angular/core';
import { Zone } from '../../models/Zone';
import { API_ROUTES } from '../constants/api-routes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZonesResponse } from '../../models/zones-response';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private http:HttpClient) { }

  getZones(): Observable<Zone[]> { 
    return this.http.get<Zone[]>(API_ROUTES.ZONES.GETALL);
  }

  addZone(credentials: any): Observable<any> {
    return this.http.post<any>(API_ROUTES.ZONES.ADD, credentials);
  }

  getAvailableZones(): Observable<ZonesResponse> {
    return this.http.get<ZonesResponse>(API_ROUTES.ZONES.GETAVAILABLE);
  }
  
  zoneData(idZona: number): Observable<any>{
    return this.http.get<any>(`${API_ROUTES.PAYMENTS}?idZona=${idZona}`);
  } 

  zonePromo(idZona: number): Observable<any>{
    return this.http.get<Zone[]>(`${API_ROUTES.COMMISSIONS}?idZona=${idZona}`);
  }
}
