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
} from '@angular/forms';

// Sweet Alert
import Swal from 'sweetalert2';

import { OrdersService } from './role-list.service';

import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgbdOrdersSortableHeader } from './role-list-sortable.directive';
import { SharedDataService } from '../../services/shared-data/shared-data.service';
import { Response } from '../../../../models/response.model';
import { RoleService } from '../../services/role/role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  providers: [OrdersService, DecimalPipe, provideFlatpickrDefaults()],
  imports: [
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
  ],
})
export class RoleListComponent {
  submitted = false;
  roleForm!: UntypedFormGroup;
  checkedList: any;
  masterSelected!: boolean;
  ListOfRolesData: any;
  newRole: any;
  // Table data
  ListOfRoles!: Observable<any[]>;
  total: Observable<number>;

  @ViewChildren(NgbdOrdersSortableHeader)
  headers!: QueryList<NgbdOrdersSortableHeader>;
  deleteModel: any;
  updatedUser: any;

  constructor(
    private modalService: NgbModal,
    public service: OrdersService,
    private formBuilder: UntypedFormBuilder,
    private roleService: RoleService,
    private shareDataService: SharedDataService
  ) {
    this.ListOfRoles = service.countries$;
    this.total = service.total$;
  }
  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
    });

    /**
     * fetches data
     */
    this.roleService.getRoles().subscribe((res: any) => {
      res.data.roles.forEach((role: any) => {
        role.name = role.name.charAt(0).toUpperCase() + role.name.slice(1);
      });
      this.shareDataService.setRolesList(res.data.roles);
    });

    this.ListOfRoles.subscribe((x) => {
      this.ListOfRolesData = Object.assign([], x);
    });
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'sm', centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.roleForm.controls;
  }

  /**
   * Save saveListJs
   */
  saveListJs() {
    if (this.roleForm.valid) {
      if (this.roleForm.get('id')?.value) {
        const updatedRole = {
          id: this.roleForm.get('id')?.value,
          name: this.roleForm.get('name')?.value,
        };
        this.roleService.updateRole(updatedRole).subscribe();
      } else {
        this.newRole = {
          name: this.roleForm.get('name')?.value,
        };

        this.roleService.addRole(this.newRole).subscribe((res: any) => {
          this.ListOfRolesData.push(this.newRole);
        });

        this.modalService.dismissAll();
      }
    }

    this.modalService.dismissAll();
    setTimeout(() => {
      this.roleForm.reset();
    }, 2000);
    this.submitted = true;
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.ListOfRolesData.forEach(
      (x: { state: any }) => (x.state = ev.target.checked)
    );
  }

  /**
   * Confirmation mail model
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
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

  /**
   * Multiple Delete
   */
  checkedValGet: any[] = [];
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
   * Open modal
   * @param content modal content
   */
  editModal(content: any, id: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'sm', centered: true });
    var listData = this.ListOfRolesData.filter(
      (data: { id: any }) => data.id === id
    );
    var updatebtn = document.getElementById('add-btn') as HTMLElement;
    updatebtn.innerHTML = 'Update';
    this.roleForm.controls['name'].setValue(listData[0].name);
    this.roleForm.controls['id'].setValue(listData[0].id);
  }
}
