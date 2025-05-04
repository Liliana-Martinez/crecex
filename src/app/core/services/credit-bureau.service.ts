import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreditBureau } from '../../models/credit-bureau';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';

@Injectable({
  providedIn: 'root'
})
export class CreditBureauService {

  constructor(private http: HttpClient) { }

  addToCreditBureau(credentials: CreditBureau): Observable<CreditBureau[]> {
    return this.http.post<CreditBureau[]>(API_ROUTES.BUREAU.ADD, credentials);
  }

  searchByName(name: string): Observable<CreditBureau[]> {
    return this.http.get<CreditBureau[]>(API_ROUTES.BUREAU.CONSULT, {
      params: { name }
    });
  }
}
