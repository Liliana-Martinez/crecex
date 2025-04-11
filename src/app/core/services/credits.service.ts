import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';
import { Cliente, NewCredit } from '../../models/credits';  // Importa las interfaces desde el modelo

@Injectable({
  providedIn: 'root'
})
export class CreditsService {

  private readonly apiUrl = API_ROUTES.CREDITS;

  constructor(private http: HttpClient) {}

  /**
   * Busca un cliente por su nombre completo.
   * @param nombreCompleto Nombre completo del cliente
   * @returns Observable con los datos del cliente o error
   */
  buscarCliente(nombreCompleto: string): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl.NEW, { nombreCompleto });
  }

  /**
   * Registra un nuevo crédito.
   * @param data Datos del nuevo crédito
   * @returns Observable con la respuesta del servidor
   */
  registrarCredito(data: NewCredit): Observable<any> {
    return this.http.post<any>(this.apiUrl.RENEW, data);
  }
}
