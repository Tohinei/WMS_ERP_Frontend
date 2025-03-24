import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
  imports: [CommonModule],
})
export class WidgetsComponent implements OnInit {
  usersCount: number = 0;
  activeUserCount: number = 0;
  adminUsersCount: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((res: any) => {
      this.usersCount = res.data.users.length;
      this.activeUserCount = res.data.users.filter((x: any) => x.status).length;
      this.adminUsersCount = res.data.users.filter(
        (x: any) => x.role.name.toLowerCase() == 'admin'
      ).length;
    });
  }
}
