import { Component, QueryList, ViewChildren } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import {
  NgbHighlight,
  NgbModal,
  NgbModalModule,
  NgbModule,
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
import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgbdOrdersSortableHeader } from './user-list-sortable.directive';
import { UserService } from '../../../core/services/user/user.service';
import { SharedDataService } from '../../../core/services/shared-data/shared-data.service';
import { ToastService } from './toast-service';
import { ToastsContainer } from './toasts-container.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-userList',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [OrdersService, DecimalPipe, provideFlatpickrDefaults()],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgbHighlight,
    NgbPagination,
    ReactiveFormsModule,
    NgbModule,
    NgbToastModule,
    NgbNavModule,
    NgbModalModule,
    NgbPaginationModule,
    NgSelectModule
],
})
export class UserListComponent {
  submitted = false;
  masterSelected!: boolean;
  userForm!: UntypedFormGroup;
  userData: any;
  deleteId: any;
  users: any;
  roles: any;
  menus: any;
  list!: Observable<any[]>;
  total: Observable<number>;
  selectedChoices: any[] = [];
  checkedValGet: any[] = [];
  @ViewChildren(NgbdOrdersSortableHeader)
  headers!: QueryList<NgbdOrdersSortableHeader>;

  constructor(
    private modalService: NgbModal,
    public toastService: ToastService,
    public service: OrdersService,
    private userService: UserService,
    private shareDataService: SharedDataService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.list = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.formValidation();
    this.toast();
    this.loadUsers();
  }

  openModal(content: any): void {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  get form() {
    return this.userForm.controls;
  }

  saveData() {
    if (this.userForm.valid) {
      this.userData = {
        userId: this.userForm.get('userId')?.value,
        firstName: this.userForm.get('firstName')?.value,
        lastName: this.userForm.get('lastName')?.value,
        password: this.userForm.get('password')?.value,
        email: this.userForm.get('email')?.value,
        roleId: this.userForm.get('roleId')?.value,
        menuId: this.userForm.get('menuId')?.value,
      };

      if (this.userForm.get('userId')?.value > 0) {
        console.log(this.userForm.value);
        this.userService.updateUser(this.userData).subscribe(
          (res: any) => {
            Swal.fire({
              text: res.message,
              icon: res.type,
            });
            this.userForm.reset();
          },
          (error) => {
            Swal.fire({
              text: 'User update failed',
              icon: 'error',
            });
          }
        );
      } else {
        this.userService.createUser(this.userData).subscribe(
          (res: any) => {
            this.users.push(this.userData);
            Swal.fire({
              text: res.message,
              icon: res.type,
            });
            this.userForm.reset();
          },
          (err: Error) => {
            console.log('Error');
          }
        );
      }
    }
    this.modalService.dismissAll();
    this.submitted = true;
  }

  checkUncheckAll(ev: any) {
    this.users.forEach((x: { state: any }) => (x.state = ev.target.checked));
  }

  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

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

  editModal(content: any, data: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
    var updatebtn = document.getElementById('add-btn') as HTMLElement;
    updatebtn.innerHTML = 'Update';
    this.userForm.controls['userId'].setValue(data.userId);
    this.userForm.controls['firstName'].setValue(data.firstName);
    this.userForm.controls['lastName'].setValue(data.lastName);
    this.userForm.controls['email'].setValue(data.email);
    this.userForm.controls['password'].setValue(data.password);
    this.userForm.controls['roleId'].setValue(data.roleId);
    this.userForm.controls['menuId'].setValue(data.menuId);
  }

  toast() {
    if (localStorage.getItem('data')) {
      this.toastService.show('Logged in Successfully.', {
        classname: 'bg-success text-center text-white ',
        delay: 5000,
      });
    }
  }

  formValidation() {
    this.userForm = this.formBuilder.group({
      userId: [0],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      roleId: [0, [Validators.required]],
      menuId: [0, [Validators.required]],
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.shareDataService.setUserList(res.data);
      this.list.subscribe((x) => {
        this.users = Object.assign([], x);
      });
    });
  }
}
