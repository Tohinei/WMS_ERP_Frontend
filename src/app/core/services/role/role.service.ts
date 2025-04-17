import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private ROLE_API = `${environment.BASE_URL}/role`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    return this.http.get<any>(this.ROLE_API);
  }

  getRoleById(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.ROLE_API}/${roleId}`);
  }

  createRole(newRole: any): Observable<any> {
    return this.http.post<any>(this.ROLE_API, newRole);
  }
  updateRole(role: any): Observable<any> {
    return this.http.put<any>(`${this.ROLE_API}`, role);
  }

  deleteRole(roleId: number): Observable<any> {
    return this.http.delete<any>(`${this.ROLE_API}/${roleId}`);
  }

  deleteRoles(roleIds: any[]): Observable<any> {
    return this.http.delete<any>(`${this.ROLE_API}/deleteMany`, {
      body: roleIds,
    });
  }
}
