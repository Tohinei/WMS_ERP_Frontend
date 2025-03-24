import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private ROLE_API = environment.apiEndpoints.role;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any>(this.ROLE_API);
  }

  addRole(role: any): Observable<any> {
    return this.http.post<any>(this.ROLE_API, role);
  }
  updateRole(role: any): Observable<any> {
    return this.http.put<any>(this.ROLE_API, role);
  }

  deleteRole(userId: number): Observable<void> {
    return this.http.delete<void>(this.ROLE_API + userId);
  }
  deleteRoles(rolesIds: any[]): Observable<void> {
    return this.http.delete<void>(`${this.ROLE_API}/deleteRoles`, {
      body: rolesIds,
    });
  }
}
