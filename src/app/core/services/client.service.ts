import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../../models/Client';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';
import { Zone } from '../../models/Zone';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  addClient(credentials: Client): Observable<Client> {
    return this.http.post<Client>(API_ROUTES.CLIGRS.ADD, credentials);
  }

  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(API_ROUTES.ZONES.GETALL);
  }
}
