import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private AUTH_API = `${environment.BASE_URL}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  signIn(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.AUTH_API}/sign-in`, credentials);
  }
  signOut(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.AUTH_API}/sign-out`, credentials);
  }
}
