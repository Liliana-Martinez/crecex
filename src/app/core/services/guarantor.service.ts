import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guarantor } from '../../models/guarantor';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';

@Injectable({
  providedIn: 'root'
})
export class GuarantorService {

  constructor(private http: HttpClient) { }

  addGuarantor(credentials: Guarantor): Observable<Guarantor> {
    return this.http.post<Guarantor>(API_ROUTES.CLIGRS.ADD.GUARANTOR, credentials);
  }

  updateGuarantor(dataToSend: any): Observable<any>{
    return this.http.put<any>(API_ROUTES.CLIGRS.MODIFY, dataToSend);
  }
}
