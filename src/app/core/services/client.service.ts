import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../../models/Client';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';
import { Zone } from '../../models/Zone';
import { AddClientResponse } from '../../models/add-client-response';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private clientId: number | null = null; 

  constructor(private http: HttpClient) { }

  addClient(credentials: Client): Observable<AddClientResponse> {
    return this.http.post<AddClientResponse>(API_ROUTES.CLIGRS.ADD.CLIENT, credentials);
  }
  /*
  getZones(): Observable<Zone[]> { 
    return this.http.get<Zone[]>(API_ROUTES.ZONES.GETALL);
  }
*/
  //Metodos para manejar el ID del cliente
  setClientId(id: number) {
    this.clientId = id;
  }

  getClientId(): number | null {
    return this.clientId;
  }

  clearClientId() {
    this.clientId = null;
  }
}
