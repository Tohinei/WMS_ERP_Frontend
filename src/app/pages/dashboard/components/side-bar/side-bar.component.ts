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
import { Link } from '../../models/link.model';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user.model';
import { AuthService } from '../../../auth/services/auth/auth.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  imports: [CommonModule, NgxSimplebarModule, RouterModule],
})
export class SideBarComponent implements OnInit {
  menu: any;
  data: any;
  parsed: any;
  toggle: any = true;
  menuItems: Link[] = [];
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.data = localStorage.getItem('data');
    this.parsed = JSON.parse(this.data);
    // this.parsed.data.loggedUser.role.menu.links
    //   .filter((item: any) => item.name.toLowerCase().includes('can'))
    //   .forEach((item: any) => this.menuItems.push(item));
    this.menuItems = this.parsed.data.loggedUser.role.menu.links;
  }

  logout() {
    const user = {
      email: this.parsed.data.loggedUser.email,
      password: this.parsed.data.loggedUser.password,
    };

    this.authService.logout(user).subscribe((res: any) => {
      localStorage.clear();
      this.router.navigate(['/']);
    });
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    var sidebarsize =
      document.documentElement.getAttribute('data-sidebar-size');
    if (sidebarsize == 'sm-hover-active') {
      document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
    } else {
      document.documentElement.setAttribute(
        'data-sidebar-size',
        'sm-hover-active'
      );
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove('vertical-sidebar-enable');
  }
}
