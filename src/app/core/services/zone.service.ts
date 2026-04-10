import { Injectable } from '@angular/core';
import { Zone } from '../../models/Zone';
import { API_ROUTES } from '../constants/api-routes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssignedZonesResponse, ZonesResponse } from '../../models/zones-response';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private http:HttpClient) { }

  getZones(): Observable<Zone[]> { 
    return this.http.get<Zone[]>(API_ROUTES.ZONES.GET_ALL);
  }

  addZone(credentials: any): Observable<any> {
    return this.http.post<any>(API_ROUTES.ZONES.CREATE, credentials);
  }

  getAvailableZones(): Observable<ZonesResponse> {
    return this.http.get<ZonesResponse>(API_ROUTES.ZONES.GET_AVAILABLE);
  }

  getAssignedZones(): Observable<AssignedZonesResponse> {
    return this.http.get<AssignedZonesResponse>(API_ROUTES.ZONES.GET_ASSIGNED);
  }
  
  zoneData(idZona: number): Observable<any>{
  return this.http.get<any>(`${API_ROUTES.PAYMENTS.GET_BY_ZONE}?idZona=${idZona}`);
  }

  zonePromo(idZona: number): Observable<any>{
  return this.http.get<Zone[]>(`${API_ROUTES.COMMISSIONS.GET_BY_ZONE}?idZona=${idZona}`);
  }
  
  updateZone(data: any) {
    return this.http.put(API_ROUTES.ZONES.UPDATE, data);
  }
}
