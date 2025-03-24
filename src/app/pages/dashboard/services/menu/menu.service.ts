import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private MENU_API = environment.apiEndpoints.menu;

  constructor(private http: HttpClient) {}

  getMenus(): Observable<any[]> {
    return this.http.get<any>(this.MENU_API);
  }
  getMenu(menuId: number): Observable<void> {
    return this.http.get<void>(`${this.MENU_API}/${menuId}`);
  }
  addMenu(menu: any): Observable<any> {
    return this.http.post<any>(this.MENU_API, menu);
  }
  updateMenu(menu: any): Observable<any> {
    return this.http.put<any>(this.MENU_API, menu);
  }
  deleteMenu(menuId: number): Observable<void> {
    return this.http.delete<void>(this.MENU_API + menuId);
  }
  deleteMenus(menusIds: any[]): Observable<void> {
    return this.http.delete<void>(`${this.MENU_API}/deleteMenus`, {
      body: menusIds,
    });
  }
}
