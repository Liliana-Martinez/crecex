import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROUTES, API_URL } from '../constants/api-routes';
import { TransactionPayload } from '../../models/transaction-payload';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor (private http: HttpClient) { }

  addTransaction(dataToSend: TransactionPayload): Observable<any> {
    return this.http.post(API_ROUTES.STATISTICS.CASH.CREATE_ENTRY, dataToSend);
  }

  //Obtener el reporte segun el tipo(diario, semanal o mensual)
  getCashReport(reportType: string):Observable<any> {
    return this.http.get(`${API_ROUTES.STATISTICS.CASH.GET_REPORT}?reportType=${reportType}`);
  }
  
  getDailyCredits(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.TOTAL_CREDITS.DAY);
  }

  getWeeklyCredits(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.TOTAL_CREDITS.WEEK);
  }

  getMonthlyCredits(): Observable<any> {
    return this.http.get(API_ROUTES.STATISTICS.TOTAL_CREDITS.MONTH);
  }

  getCreditsByZone(codigoZona: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_ROUTES.STATISTICS.TOTAL_PAYMENTS}?zona=${codigoZona}`);
  }

}
