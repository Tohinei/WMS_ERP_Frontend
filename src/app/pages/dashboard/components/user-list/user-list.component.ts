import { Component, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import {
  NgbHighlight,
  NgbModal,
  NgbModalModule,
  NgbModule,
  NgbNavChangeEvent,
  NgbNavModule,
  NgbPagination,
  NgbPaginationModule,
  NgbToastModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import { OrdersService } from './user-list.service';

import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { NgbdOrdersSortableHeader } from './user-list-sortable.directive';
import { UserService } from '../../services/user/user.service';
import { SharedDataService } from '../../services/shared-data/shared-data.service';
import { RoleService } from '../../services/role/role.service';
import { MenuService } from '../../services/menu/menu.service';
import { ToastService } from './toast-service';
import { ToastsContainer } from './toasts-container.component';
import { LinkListComponent } from '../link-list/link-list.component';
import { RoleListComponent } from '../role-list/role-list.component';
import { MenuListComponent } from '../menu-list/menu-list.component';
import { LinkService } from '../../services/link/link.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { WidgetsComponent } from '../../widgets/widgets.component';

@Component({
  selector: 'app-userList',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [OrdersService, DecimalPipe, provideFlatpickrDefaults()],
  imports: [
    CommonModule,
    FormsModule,
    NgbHighlight,
    NgbPagination,
    ReactiveFormsModule,
    NgbModule,
    WidgetsComponent,
    NgbToastModule,
    ToastsContainer,
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    LinkListComponent,
    RoleListComponent,
    MenuListComponent,
    NgSelectModule,
    WidgetsComponent,
  ],
})
export class UserListComponent {
  switchMenu = false;
  submitted = false;
  masterSelected!: boolean;
  userForm!: UntypedFormGroup;
  userData: any;
  deleteId: any;
  users: any;
  links: any;
  roles: any;
  menus: any;
  list!: Observable<any[]>;
  total: Observable<number>;
  selectedChoices: any[] = [];
  checkedValGet: any[] = [];
  items: any;
  deleteModel: any;
  @ViewChildren(NgbdOrdersSortableHeader)
  headers!: QueryList<NgbdOrdersSortableHeader>;

  constructor(
    // Modal & Notifications
    private modalService: NgbModal,
    public toastService: ToastService,

    // Services for Data Management
    public service: OrdersService,
    private userService: UserService,
    private roleService: RoleService,
    private menuService: MenuService,
    private linkService: LinkService,
    private shareDataService: SharedDataService,

    // Form Management
    private formBuilder: UntypedFormBuilder
  ) {
    this.list = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.formValidation(); // Form validation

    this.toast(); // Show notifications

    this.loadRoles(); // Load roles
    this.loadMenus(); // Load menus
    this.loadLinks(); // Load links
    this.loadUsers(); // Load users
  }

  /**
    @param content
   */
  openModal(content: any): void {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
  }
  // Get form
  get form() {
    return this.userForm.controls;
  }
  // Save Data
  saveData() {
    // if (this.switchMenu) {
    //   const newMenu = {
    //     name: this.userForm.get('newMenuName')?.value,
    //     links: this.items,
    //   };
    //   this.menuService.addMenu(newMenu).subscribe((res: any) => {
    //     this.userForm.patchValue({ menuId: res.data });
    //     this.userForm.patchValue({
    //       menuName: this.userForm.get('newMenuName')?.value,
    //     });
    //   });
    // }
    this.roles.forEach((item: any) => {
      if (item.id == this.userForm.get('roleId')?.value)
        this.userForm.patchValue({ roleName: item.name });
    });
    this.menus.forEach((item: any) => {
      if (item.id == this.userForm.get('menuId')?.value)
        this.userForm.patchValue({ menuName: item.name });
    });

    if (this.userForm.valid) {
      this.userData = {
        id: this.userForm.get('id')?.value,
        firstName: this.userForm.get('firstName')?.value,
        lastName: this.userForm.get('lastName')?.value,
        email: this.userForm.get('email')?.value,
        password: this.userForm.get('password')?.value,
        birthDate: this.userForm.get('birthDate')?.value,
        roleId: this.userForm.get('roleId')?.value,
        role: {
          id: this.userForm.get('roleId')?.value,
          name: this.userForm.get('roleName')?.value,
          menuId: this.userForm.get('menuId')?.value,
          menu: {
            id: this.userForm.get('menuId')?.value,
            name: this.userForm.get('menuName')?.value,
            links: this.userForm.get('selectedChoices')?.value,
          },
        },
      };

      if (this.userForm.get('id')?.value > 0) {
        this.userService.updateUser(this.userData).subscribe(
          (res: any) => {
            Swal.fire({
              text: res.message,
              icon: res.type,
            });
            console.log(this.userData);
            this.userForm.reset();
          },
          (error) => {
            Swal.fire({
              text: 'user didnt updated',
              icon: 'error',
            });
          }
        );
      } else {
        this.userForm.reset();
        this.userData.status = false;
        this.userService.addUser(this.userData).subscribe((res: any) => {
          this.users.push(this.userData);
          Swal.fire({
            text: res.data.message,
            icon: res.data.type,
          });
          this.userForm.reset();
        });
      }
    }
    this.modalService.dismissAll();
    setTimeout(() => {}, 2000);
    this.submitted = true;
  }
  // Check/ Uncheck all Items
  checkUncheckAll(ev: any) {
    this.users.forEach((x: { state: any }) => (x.state = ev.target.checked));
  }
  // Confirmation Model
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  // Delete Data
  deleteData(id: any) {
    if (id) {
      document.getElementById('lj_' + id)?.remove();
      this.userService.deleteUser(id).subscribe();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('lj_' + item)?.remove();
      });
      this.userService.deleteUsers(this.checkedValGet).subscribe();
    }
  }
  //  Multiple Delete
  deleteMultiple(content: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    var result;
    var checkedVal: any[] = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    if (checkedVal.length > 0) {
      this.modalService.open(content, { centered: true });
    } else {
      Swal.fire({
        text: 'Please select at least one checkbox',
        confirmButtonColor: '#239eba',
      });
    }
    this.checkedValGet = checkedVal;
  }
  /**
   @param content 
   */
  editModal(content: any, data: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
    var updatebtn = document.getElementById('add-btn') as HTMLElement;
    updatebtn.innerHTML = 'Update';
    this.userForm.controls['id'].setValue(data.id);
    this.userForm.controls['firstName'].setValue(data.firstName);
    this.userForm.controls['lastName'].setValue(data.lastName);
    this.userForm.controls['email'].setValue(data.email);
    this.userForm.controls['birthDate'].setValue(data.birthDate);
    this.userForm.controls['roleId'].setValue(data.roleId);
    this.userForm.controls['roleName'].setValue(data.roleName);
    this.userForm.controls['menuId'].setValue(data.role.menuId);
    this.userForm.controls['menuName'].setValue(data.role.menuName);
    this.userForm.controls['selectedChoices'].setValue(data.role.menu.links);
  }
  // On Change Choices
  onChange(selectedItems: any) {
    this.userForm.patchValue({ selectedChoices: selectedItems });
  }
  // On Change Role
  onChangeMenu(event: any) {
    const id = event.target.value;
    if (id > 0) {
      this.menuService.getMenu(Number(id)).subscribe((res: any) => {
        this.userForm.patchValue({ selectedChoices: res.links });
      });
    }
  }
  // Switch Between Existing Menu and New Menu
  switchMenuInput() {
    this.switchMenu = !this.switchMenu;
    this.userForm?.controls['selectedChoices']?.setValue([]);
  }

  toast() {
    if (localStorage.getItem('data')) {
      this.toastService.show('Logged in Successfull.', {
        classname: 'bg-success text-center text-white ',
        delay: 5000,
      });
    }
  }
  formValidation() {
    this.userForm = this.formBuilder.group({
      id: [0, [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      roleId: [0, [Validators.required]],
      roleName: [0, [Validators.required]],
      menuId: [0, [Validators.required]],
      menuName: [0, [Validators.required]],
      newMenuName: [null],
      selectedChoices: new FormControl([]),
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      res.data.users.forEach((user: any) => {
        user.createdAt = new Date(user.createdAt).toISOString().split('T')[0];
        user.birthDate = new Date(user.birthDate).toISOString().split('T')[0];
        user.firstName =
          user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
        user.lastName =
          user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);
        user.role.name =
          user.role.name.charAt(0).toUpperCase() + user.role.name.slice(1);
        user.role.menu.name =
          user.role.menu.name.charAt(0).toUpperCase() +
          user.role.menu.name.slice(1);
      });
      this.shareDataService.setUserList(res.data.users);
      this.list.subscribe((x) => {
        this.users = Object.assign([], x);
      });
    });
  }
  loadRoles() {
    this.roleService.getRoles().subscribe((res: any) => {
      res.data.roles.forEach((role: any) => {
        role.name = role.name.charAt(0).toUpperCase() + role.name.slice(1);
      });
      this.roles = res.data.roles;
    });
  }
  loadMenus() {
    this.menuService.getMenus().subscribe((res: any) => {
      res.data.menus.forEach((menu: any) => {
        menu.name = menu.name.charAt(0).toUpperCase() + menu.name.slice(1);
      });
      this.menus = res.data.menus;
    });
  }
  loadLinks() {
    this.linkService.getLinks().subscribe((res: any) => {
      res.data.links.forEach((link: any) => {
        link.name = link.name.charAt(0).toUpperCase() + link.name.slice(1);
      });
      this.links = res.data.links;
    });
  }
}
