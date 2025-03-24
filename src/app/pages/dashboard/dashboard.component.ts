import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedDataService } from './services/shared-data/shared-data.service';
import { UserListComponent } from './components/user-list/user-list.component';
import { ToastService } from './components/user-list/toast-service';
import { ToastsContainer } from './components/user-list/toasts-container.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { Link } from './models/link.model';
import { SideBarComponent } from './components/side-bar/side-bar.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    UserListComponent,
    UserListComponent,
    NgbToastModule,
    SideBarComponent,
  ],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  SidebarHide() {
    throw new Error('Method not implemented.');
  }
  data: any;
  loggedUser: any;
  menu!: Link[];

  constructor() {}

  ngOnInit(): void {
    this.data = localStorage.getItem('data');
    const parsed = JSON.parse(this.data);
    this.menu = parsed.data.loggedUser.role.links;
  }
}
