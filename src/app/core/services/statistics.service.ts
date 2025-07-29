import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES, API_URL } from '../constants/api-routes';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor (private http: HttpClient) { }

  getInitialAmountDaily(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.CASH.FORM);
  }

  getDailyCashReport(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.CASH.DAY);
  }

  getWeeklyCashReport(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.CASH.WEEK);
  }

  getMonthlyCashReport(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.CASH.MONTH);
  }
  
  getDailyCredits(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.TOTCRED.DAY);
  }

  getWeeklyCredits(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.TOTCRED.WEEK);
  }

  getMonthlyCredits(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.TOTCRED.MONTH);
  }

  getCreditsByZone(codigoZona: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_ROUTES.STATISTICS.TOTPAYM}?zona=${codigoZona}`);
  }

}
