import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  AUTH_API = environment.apiEndpoints.auth;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    const { email, password } = credentials;
    return this.http.post<any>(`${this.AUTH_API}/login`, {
      email,
      password,
    });
  }

  logout(credentials: { email: string; password: string }) {
    const { email, password } = credentials;
    return this.http.post<any>(`${this.AUTH_API}/logout`, {
      email,
      password,
      
    });
  }
}
