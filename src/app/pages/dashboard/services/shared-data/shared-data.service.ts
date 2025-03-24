import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Link } from '../../models/link.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private menuSource = new BehaviorSubject<Link[]>([]);
  private userList: any;
  private menusList: any;
  private rolesList: any;
  private currentUser: any;
  private linksList: any;
  /**
   *
   */
  constructor() {
    this.userList = [];
    this.linksList = [];
    this.menusList = [];
    this.rolesList = [];
    this.currentUser = null;
  }
  currentMenu = this.menuSource.asObservable();

  changeMessage(menu: Link[]) {
    this.menuSource.next(menu);
  }

  private list = new BehaviorSubject<User[]>([]);

  changeList(list: Link[]) {
    this.menuSource.next(list);
  }

  setUserList(data: any): void {
    this.userList = data;
  }

  getUserList(): any {
    return this.userList;
  }
  setLinksList(data: any): void {
    this.linksList = data;
  }

  getLinksList(): any {
    return this.linksList;
  }
  setRolesList(data: any): void {
    this.rolesList = data;
  }

  getRolesList(): any {
    return this.rolesList;
  }
  setMenusList(data: any): void {
    this.menusList = data;
  }
  getMenusList(): any {
    return this.menusList;
  }
  setCurrentUser(currentUser: any): void {
    this.currentUser = currentUser;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }
}
