import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Response } from '../../../models/response.model';
import { SharedDataService } from '../../dashboard/services/shared-data/shared-data.service';
import { UserService } from '../../dashboard/services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../dashboard/models/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  fieldTextType!: boolean;

  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe(
      (res: any) => {
        localStorage.setItem('data', JSON.stringify(res));
        this.router.navigate(['/dashboard']);
      },
      (err) => Swal.fire({ text: 'Invalid credentials', icon: 'error' })
    );
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
