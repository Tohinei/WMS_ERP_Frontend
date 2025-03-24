import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Response } from '../../../../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private LINK_API = environment.apiEndpoints.link;

  constructor(private http: HttpClient) {}

  getLinks(): Observable<Response> {
    return this.http.get<any>(this.LINK_API);
  }

  addLink(link: any): Observable<any> {
    return this.http.post<any>(this.LINK_API, link);
  }
  updateLink(link: any): Observable<any> {
    return this.http.put<any>(this.LINK_API, link);
  }

  deleteLink(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.LINK_API}/${userId}`);
  }

  deleteLinks(linksIds: any[]): Observable<void> {
    return this.http.delete<void>(`${this.LINK_API}/deleteLinks`, {
      body: linksIds,
    });
  }
}
