import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSimplebarModule } from 'ngx-simplebar';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';
import { MenuService } from '../../../core/services/menu/menu.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  imports: [CommonModule, NgxSimplebarModule, RouterModule],
})
export class SideBarComponent implements OnInit {
  data: any;
  parsed: any;
  toggle: any = true;
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  menu: any[] = [];
  menuName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private menuService: MenuService
  ) {}
 
  ngOnInit(): void {
    this.data = localStorage.getItem('data');
    this.menu = JSON.parse(this.data).data.loggedUser.menu.sessions;
    this.menuName = JSON.parse(this.data).data.loggedUser.menu.menuName;
   }

  logout() {
     localStorage.clear();
    this.router.navigate(['/']);
  }

  /**
   * Toggle the menu bar when having mobile screen
   */

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove('vertical-sidebar-enable');
  }
}
