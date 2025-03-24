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

import { OrdersService } from './menu-list.service';

import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { NgbdOrdersSortableHeader } from './menu-list-sortable.directive';
import { SharedDataService } from '../../services/shared-data/shared-data.service';
import { MenuService } from '../../services/menu/menu.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
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
export class MenuListComponent {
  submitted = false;
  menuForm!: UntypedFormGroup;
  checkedList: any;
  masterSelected!: boolean;
  ListOfMenusData: any;
  newMenu: any;
  // Table data
  ListOfMenus!: Observable<any[]>;
  total: Observable<number>;

  @ViewChildren(NgbdOrdersSortableHeader)
  headers!: QueryList<NgbdOrdersSortableHeader>;
  deleteModel: any;
  updatedUser: any;

  constructor(
    private modalService: NgbModal,
    public service: OrdersService,
    private formBuilder: UntypedFormBuilder,
    private menuService: MenuService,
    private shareDataService: SharedDataService
  ) {
    this.ListOfMenus = service.countries$;
    this.total = service.total$;
  }
  ngOnInit(): void {
    this.menuForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
    });

    /**
     * fetches data
     */
    this.menuService.getMenus().subscribe((res: any) => {
      res.data.menus.forEach((menu: any) => {
        menu.name = menu.name.charAt(0).toUpperCase() + menu.name.slice(1);
      });
      this.shareDataService.setMenusList(res.data.menus);
    });

    this.ListOfMenus.subscribe((x) => {
      this.ListOfMenusData = Object.assign([], x);
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
    return this.menuForm.controls;
  }

  /**
   * Save saveListJs
   */
  saveListJs() {
    if (this.menuForm.valid) {
      if (this.menuForm.get('id')?.value) {
        const updatedMenu = {
          id: this.menuForm.get('id')?.value,
          name: this.menuForm.get('name')?.value,
        };
        this.menuService.updateMenu(updatedMenu).subscribe();
      } else {
        this.newMenu = {
          name: this.menuForm.get('name')?.value,
        };

        this.menuService.addMenu(this.newMenu).subscribe((res: any) => {
          this.ListOfMenusData.push(this.newMenu);
        });

        this.modalService.dismissAll();
      }
    }

    this.modalService.dismissAll();
    setTimeout(() => {
      this.menuForm.reset();
    }, 2000);
    this.submitted = true;
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.ListOfMenusData.forEach(
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
      this.menuService.deleteMenu(id).subscribe();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('lj_' + item)?.remove();
      });
      this.menuService.deleteMenus(this.checkedValGet).subscribe();
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
    var listData = this.ListOfMenusData.filter(
      (data: { id: any }) => data.id === id
    );
    var updatebtn = document.getElementById('add-btn') as HTMLElement;
    updatebtn.innerHTML = 'Update';
    this.menuForm.controls['name'].setValue(listData[0].name);
    this.menuForm.controls['id'].setValue(listData[0].id);
  }
}
