import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private USER_API = `${environment.BASE_URL}/user`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(this.USER_API);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.USER_API}/${userId}`);
  }

  createUser(newUser: any): Observable<any> {
    return this.http.post<any>(this.USER_API, newUser);
  }
  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.USER_API}`, user);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.USER_API}/${userId}`);
  }

  deleteUsers(userIds: any[]): Observable<any> {
    return this.http.delete<any>(`${this.USER_API}/many`, {
      body: userIds,
    });
  }
}
