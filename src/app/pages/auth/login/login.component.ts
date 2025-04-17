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
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastsContainer } from '../../../shared/components/user-list/toasts-container.component';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    ToastsContainer,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  fieldTextType!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    localStorage.clear();
    this.initializeLoginForm();
  }

  private initializeLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['wael.doe@example.com', [Validators.required, Validators.email]],
      password: ['wael', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        text: 'fill out all required fields',
        icon: 'warning',
      });
      return;
    }
    const { email, password } = this.loginForm.value;

    this.authService.signIn({ email, password }).subscribe(
      (res: any) => {
        localStorage.setItem('data', JSON.stringify(res));
        if (res.data.loggedUser.roleId == 1)
          this.router.navigate(['/dashboard']);
        else this.router.navigate(['/hasNoAcess']);
      },
      (err: Error) => Swal.fire({ text: 'Invalid credentials', icon: 'error' })
    );
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
