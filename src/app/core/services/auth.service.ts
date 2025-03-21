import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../../models/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth/lo';

  constructor(private http: HttpClient) {}

  login(auth: Auth): Observable<any> {
    return this.http.post("http://localhost:8080/login", auth);
  }
}
