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

import { OrdersService } from './role-list.service';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgbdOrdersSortableHeader } from './role-list-sortable.directive';
import { RoleService } from '../../../core/services/role/role.service';
import { SharedDataService } from '../../../core/services/shared-data/shared-data.service';
import { ToastService } from './toast-service';
import { ToastsContainer } from './toasts-container.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-role-list',
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
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent {
  submitted = false;
  masterSelected!: boolean;
  roleForm!: UntypedFormGroup;
  roleData: any;
  deleteId: any;
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
    private roleService: RoleService,
    private shareDataService: SharedDataService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.list = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.formValidation();
    this.toast();
    this.loadRoles();
  }

  openModal(content: any): void {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  get form() {
    return this.roleForm.controls;
  }

  saveData() {
    if (this.roleForm.valid) {
      this.roleData = {
        roleId: this.roleForm.get('roleId')?.value,
        roleName: this.roleForm.get('roleName')?.value,
        description: this.roleForm.get('description')?.value,
      };

      if (this.roleForm.get('roleId')?.value > 0) {
        console.log(this.roleForm.value);
        this.roleService.updateRole(this.roleData).subscribe(
          (res: any) => {
            Swal.fire({
              text: res.message,
              icon: res.type,
            });
            this.roleForm.reset();
          },
          (error) => {
            Swal.fire({
              text: 'Role update failed',
              icon: 'error',
            });
          }
        );
      } else {
        this.roleService.createRole(this.roleData).subscribe(
          (res: any) => {
            this.roles.push(this.roleData);
            Swal.fire({
              text: res.message,
              icon: res.type,
            });
            this.roleForm.reset();
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
    this.roles.forEach((x: { state: any }) => (x.state = ev.target.checked));
  }

  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  deleteData(id: any) {
    if (id) {
      document.getElementById('lj_' + id)?.remove();
      this.roleService.deleteRole(id).subscribe();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('lj_' + item)?.remove();
      });
      this.roleService.deleteRoles(this.checkedValGet).subscribe();
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
    this.roleForm.controls['roleId'].setValue(data.roleId);
    this.roleForm.controls['roleName'].setValue(data.roleName);
    this.roleForm.controls['description'].setValue(data.description);
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
    this.roleForm = this.formBuilder.group({
      roleId: [0],
      roleName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  loadRoles() {
    this.roleService.getRoles().subscribe((res: any) => {
      this.shareDataService.setRoleList(res.data);
      console.log(res.data);
      this.list.subscribe((x) => {
        this.roles = Object.assign([], x);
      });
    });
  }
}
