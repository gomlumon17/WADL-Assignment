import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-wrapper">
      <div class="register-card">
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              formControlName="username"
              placeholder="Enter username"
            />
            <div
              class="error"
              *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
            >
              Username is required.
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" formControlName="email" placeholder="Enter email" />
            <div
              class="error"
              *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
            >
              Please enter a valid email.
            </div>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              placeholder="Enter password"
            />
            <div
              class="error"
              *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            >
              Password is required.
            </div>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              placeholder="Confirm password"
            />
            <div
              class="error"
              *ngIf="
                registerForm.get('confirmPassword')?.invalid &&
                registerForm.get('confirmPassword')?.touched
              "
            >
              Passwords must match.
            </div>
          </div>
          <button type="submit" [disabled]="!registerForm.valid" class="btn btn-primary">
            Register
          </button>
        </form>
        <p class="link">Already have an account? <a routerLink="/login">Login</a></p>
      </div>
    </div>
  `,
  styles: [
    `
      .register-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }
      .register-card {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
      }
      h2 {
        text-align: center;
        margin-bottom: 30px;
        color: #333;
      }
      .form-group {
        margin-bottom: 20px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: #555;
      }
      input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        box-sizing: border-box;
      }
      input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
      }
      .error {
        color: #e74c3c;
        font-size: 14px;
        margin-top: 5px;
      }
      .btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .btn-primary {
        background-color: #667eea;
        color: white;
      }
      .btn-primary:hover:not(:disabled) {
        background-color: #5a6fd8;
      }
      .btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
      .link {
        text-align: center;
        margin-top: 20px;
      }
      a {
        color: #667eea;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      // Clear previous mismatch error
      if (confirmPassword.hasError('mismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };
      // Save to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful! Please login.');
      this.router.navigate(['/login']);
    }
  }
}
