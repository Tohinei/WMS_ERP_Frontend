import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SideBarComponent } from '../../shared/components/side-bar/side-bar.component';
import { UserListComponent } from '../../shared/components/user-list/user-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    NgbToastModule,
    SideBarComponent
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

  constructor() {}

  ngOnInit(): void {
    this.data = localStorage.getItem('data');
    const parsed = JSON.parse(this.data);
  }
}
