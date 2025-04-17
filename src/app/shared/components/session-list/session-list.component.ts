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

import { OrdersService } from './session-list.service';
import { provideFlatpickrDefaults } from 'angularx-flatpickr';
import { NgbdOrdersSortableHeader } from './session-list-sortable.directive';
import { SessionService } from '../../../core/services/session/session.service';
import { SharedDataService } from '../../../core/services/shared-data/shared-data.service';
import { ToastService } from './toast-service';
import { ToastsContainer } from './toasts-container.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-session-list',
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
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.scss',
})
export class SessionListComponent {
  submitted = false;
  masterSelected!: boolean;
  sessionForm!: UntypedFormGroup;
  sessionData: any;
  deleteId: any;
  sessions: any;
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
    private sessionService: SessionService,
    private shareDataService: SharedDataService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.list = service.countries$;
    this.total = service.total$;
  }

  ngOnInit(): void {
    this.formValidation();
    this.toast();
    this.loadSessions();
  }

  openModal(content: any): void {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  get form() {
    return this.sessionForm.controls;
  }

  saveData() {
    if (this.sessionForm.valid) {
      this.sessionData = {
        sessionId: this.sessionForm.get('sessionId')?.value,
        sessionName: this.sessionForm.get('sessionName')?.value,
        path: this.sessionForm.get('path')?.value,
        icon: this.sessionForm.get('icon')?.value,
        menuId: this.sessionForm.get('menuId')?.value,
      };

      if (this.sessionForm.get('sessionId')?.value > 0) {
        console.log(this.sessionForm.value);
        this.sessionService.updateSession(this.sessionData).subscribe(
          (res: any) => {
            Swal.fire({
              text: res.message,
              icon: res.type,
            });
            this.sessionForm.reset();
          },
          (error) => {
            Swal.fire({
              text: 'Session update failed',
              icon: 'error',
            });
          }
        );
      } else {
        this.sessionService.createSession(this.sessionData).subscribe(
          (res: any) => {
            console.log(this.sessionData);
            this.sessions.push(this.sessionData);
            Swal.fire({
              text: res.message,
              icon: res.type,
            });
            this.sessionForm.reset();
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
    this.sessions.forEach((x: { state: any }) => (x.state = ev.target.checked));
  }

  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  deleteData(id: any) {
    if (id) {
      document.getElementById('lj_' + id)?.remove();
      this.sessionService.deleteSession(id).subscribe();
    } else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('lj_' + item)?.remove();
      });
      this.sessionService.deleteSessions(this.checkedValGet).subscribe();
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
    this.sessionForm.controls['sessionId'].setValue(data.sessionId);
    this.sessionForm.controls['sessionName'].setValue(data.sessionName);
    this.sessionForm.controls['path'].setValue(data.path);
    this.sessionForm.controls['icon'].setValue(data.icon);
    this.sessionForm.controls['menuId'].setValue(data.menuId);
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
    this.sessionForm = this.formBuilder.group({
      sessionId: [0],
      sessionName: ['', [Validators.required]],
      path: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      menuId: [0, [Validators.required]],
    });
  }

  loadSessions() {
    this.sessionService.getSessions().subscribe((res: any) => {
      this.shareDataService.setSessionList(res.data);
      console.log(res.data);
      this.list.subscribe((x) => {
        this.sessions = Object.assign([], x);
      });
    });
  }
}
