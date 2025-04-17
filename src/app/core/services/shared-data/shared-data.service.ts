import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private menuSource = new BehaviorSubject<any[]>([]);
  private userList: any;
  private menusList: any;
  private rolesList: any;
  private currentUser: any;
  private sessionList: any;

  private menuReady = false;
  /**
   *
   */
  constructor() {
    this.userList = [];
    this.sessionList = [];
    this.menusList = [];
    this.rolesList = [];
    this.currentUser = null;
    this.menuReady = false;
  }
  currentMenu = this.menuSource.asObservable();

  changeMessage(menu: any[]) {
    this.menuSource.next(menu);
  }

  private list = new BehaviorSubject<User[]>([]);

  changeList(list: any[]) {
    this.menuSource.next(list);
  }

  setUserList(data: any): void {
    this.userList = data;
  }

  getUserList(): any {
    return this.userList;
  }
  setSessionList(data: any): void {
    this.sessionList = data;
  }

  getSessionList(): any {
    return this.sessionList;
  }
  setRoleList(data: any): void {
    this.rolesList = data;
  }

  getRoleList(): any {
    return this.rolesList;
  }
  setMenuList(data: any): void {
    this.menusList = data;
  }
  getMenuList(): any {
    return this.menusList;
  }
  setCurrentUser(currentUser: any): void {
    this.currentUser = currentUser;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  getMenuReady(): any {
    return this.menuReady;
  }

  setMenuReady(menuReady: any): void {
    this.menuReady = menuReady;
  }
}
