import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Response } from '../../../../models/response.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private USER_API = environment.apiEndpoints.user;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<any>(this.USER_API);
  }

  addUser(user: any): Observable<User> {
    return this.http.post<any>(this.USER_API, user);
  }
  updateUser(user: any): Observable<any> {
    return this.http.put<any>(this.USER_API, user);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.USER_API}/${userId}`);
  }

  deleteUsers(userIds: any[]): Observable<void> {
    return this.http.delete<void>(`${this.USER_API}/deleteUsers`, {
      body: userIds,
    });
  }
}
