import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private SESSION_API = `${environment.BASE_URL}/session`;

  constructor(private http: HttpClient) {}

  getSessions(): Observable<any> {
    return this.http.get<any>(this.SESSION_API);
  }

  getSessionById(sessionId: number): Observable<any> {
    return this.http.get<any>(`${this.SESSION_API}/${sessionId}`);
  }

  createSession(newSession: any): Observable<any> {
    return this.http.post<any>(this.SESSION_API, newSession);
  }

  updateSession(session: any): Observable<any> {
    return this.http.put<any>(`${this.SESSION_API}`, session);
  }

  deleteSession(sessionId: number): Observable<any> {
    return this.http.delete<any>(`${this.SESSION_API}/${sessionId}`);
  }

  deleteSessions(sessionIds: any[]): Observable<any> {
    return this.http.delete<any>(`${this.SESSION_API}/deleteMany`, {
      body: sessionIds,
    });
  }
}
