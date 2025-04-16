import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/credits'; // importamos el modelo

@Injectable({
  providedIn: 'root'
})
export class CreditsService {

  private apiUrl = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) {}

  obtenerDatosCliente(nombre: string, apellidoPaterno: string, apellidoMaterno: string): Observable<Cliente> {
    const params = new URLSearchParams({
      nombre,
      apellidoPaterno,
      apellidoMaterno
    });

    return this.http.get<Cliente>(`${this.apiUrl}/buscarUno?${params.toString()}`);
  }
}
