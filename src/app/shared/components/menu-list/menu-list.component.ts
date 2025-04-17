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

import { OrdersService } from './menu-list.service';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgbdOrdersSortableHeader } from './menu-list-sortable.directive';
import { MenuService } from '../../../core/services/menu/menu.service';
import { SharedDataService } from '../../../core/services/shared-data/shared-data.service';
import { ToastService } from './toast-service';
import { ToastsContainer } from './toasts-container.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-menu-list',
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
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
})
export class MenuListComponent {
  submitted = false;
  masterSelected!: boolean;
  menuForm!: UntypedFormGroup;
  menuData: any;
  deleteId: any;
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
    private menuService: MenuService,
    private shareDataService: SharedDataService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.list = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.formValidation();
    this.toast();
    this.loadMenus();
  }

  openModal(content: any): void {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  get form() {
    return this.menuForm.controls;
  }

  saveData() {
    if (this.menuForm.valid) {
      this.menuData = {
        menuId: this.menuForm.get('menuId')?.value,
        menuName: this.menuForm.get('menuName')?.value,
        description: this.menuForm.get('description')?.value,
      };

      if (this.menuForm.get('menuId')?.value > 0) {
        console.log(this.menuForm.value);
        this.menuService.updateMenu(this.menuData).subscribe(
          (res: any) => {
            Swal.fire({
              text: res.message,
              icon: res.type,
            });
            this.menuForm.reset();
          },
          (error) => {
            Swal.fire({
              text: 'Menu update failed',
              icon: 'error',
            });
          }
        );
      } else {
        this.menuService.createMenu(this.menuData).subscribe(
          (res: any) => {
            this.menus.push(this.menuData);
            Swal.fire({
              text: res.message,
              icon: res.type,
            });
            this.menuForm.reset();
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
    this.menus.forEach((x: { state: any }) => (x.state = ev.target.checked));
  }

  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  deleteData(id: any) {
    if (id) {
      document.getElementById('lj_' + id)?.remove();
      this.menuService.deleteMenu(id).subscribe();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('lj_' + item)?.remove();
      });
      this.menuService.deleteMenus(this.checkedValGet).subscribe();
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
    this.menuForm.controls['menuId'].setValue(data.menuId);
    this.menuForm.controls['menuName'].setValue(data.menuName);
    this.menuForm.controls['description'].setValue(data.description);
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
    this.menuForm = this.formBuilder.group({
      menuId: [0],
      menuName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  loadMenus() {
    this.menuService.getMenus().subscribe((res: any) => {
      this.shareDataService.setMenuList(res.data);
      console.log(res.data);
      this.list.subscribe((x) => {
        this.menus = Object.assign([], x);
      });
    });
  }
}
