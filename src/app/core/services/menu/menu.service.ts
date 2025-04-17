import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private MENU_API = `${environment.BASE_URL}/menu`;

  constructor(private http: HttpClient) {}

  getMenus(): Observable<any> {
    return this.http.get<any>(this.MENU_API);
  }

  getMenuById(menuId: number): Observable<any> {
    return this.http.get<any>(`${this.MENU_API}/${menuId}`);
  }

  createMenu(newMenu: any): Observable<any> {
    return this.http.post<any>(this.MENU_API, newMenu);
  }
  updateMenu(menu: any): Observable<any> {
    return this.http.put<any>(`${this.MENU_API}`, menu);
  }

  deleteMenu(menuId: number): Observable<any> {
    return this.http.delete<any>(`${this.MENU_API}/${menuId}`);
  }

  deleteMenus(menuIds: any[]): Observable<any> {
    return this.http.delete<any>(`${this.MENU_API}/deleteMany`, {
      body: menuIds,
    });
  }
}
