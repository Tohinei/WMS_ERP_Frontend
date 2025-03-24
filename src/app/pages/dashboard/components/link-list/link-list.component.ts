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

import { OrdersService } from './link-list.service';

import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgbdOrdersSortableHeader } from './link-list-sortable.directive';
import { SharedDataService } from '../../services/shared-data/shared-data.service';
import { Response } from '../../../../models/response.model';
import { LinkService } from '../../services/link/link.service';

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
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
export class LinkListComponent {
  submitted = false;
  linkForm!: UntypedFormGroup;
  checkedList: any;
  masterSelected!: boolean;
  ListOfLinksData: any;
  newLink: any;
  // Table data
  ListOfLinks!: Observable<any[]>;
  total: Observable<number>;

  @ViewChildren(NgbdOrdersSortableHeader)
  headers!: QueryList<NgbdOrdersSortableHeader>;
  deleteModel: any;
  updatedUser: any;

  constructor(
    private modalService: NgbModal,
    public service: OrdersService,
    private formBuilder: UntypedFormBuilder,
    private linkService: LinkService,
    private shareDataService: SharedDataService
  ) {
    this.ListOfLinks = service.countries$;
    this.total = service.total$;
  }
  ngOnInit(): void {
    this.linkForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
    });

    /**
     * fetches data
     */
    this.linkService.getLinks().subscribe((res: Response) => {
      res.data.links.forEach((link: any) => {
        link.name = link.name.charAt(0).toUpperCase() + link.name.slice(1);
      });
      this.shareDataService.setLinksList(res.data.links);
    });

    this.ListOfLinks.subscribe((x) => {
      this.ListOfLinksData = Object.assign([], x);
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
    return this.linkForm.controls;
  }

  /**
   * Save saveListJs
   */
  saveListJs() {
    if (this.linkForm.valid) {
      if (this.linkForm.get('id')?.value) {
        const updatedLink = {
          id: this.linkForm.get('id')?.value,
          name: this.linkForm.get('name')?.value,
        };
        this.linkService.updateLink(updatedLink).subscribe();
      } else {
        this.newLink = {
          name: this.linkForm.get('name')?.value,
        };

        this.linkService.addLink(this.newLink).subscribe((res: any) => {
          this.ListOfLinksData.push(this.newLink);
        });

        this.modalService.dismissAll();
      }
    }

    this.modalService.dismissAll();
    setTimeout(() => {
      this.linkForm.reset();
    }, 2000);
    this.submitted = true;
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.ListOfLinksData.forEach(
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
      this.linkService.deleteLink(id).subscribe();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('lj_' + item)?.remove();
      });
      this.linkService.deleteLinks(this.checkedValGet).subscribe();
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
    var listData = this.ListOfLinksData.filter(
      (data: { id: any }) => data.id === id
    );
    var updatebtn = document.getElementById('add-btn') as HTMLElement;
    updatebtn.innerHTML = 'Update';
    this.linkForm.controls['name'].setValue(listData[0].name);
    this.linkForm.controls['id'].setValue(listData[0].id);
  }
}
