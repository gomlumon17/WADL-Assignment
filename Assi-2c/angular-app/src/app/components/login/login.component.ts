import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
              *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
            >
              Username is required.
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
              *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
              Password is required.
            </div>
          </div>
          <button type="submit" [disabled]="!loginForm.valid" class="btn btn-primary">Login</button>
        </form>
        <p class="link">Don't have an account? <a routerLink="/register">Register</a></p>
        <div class="error" *ngIf="loginError">{{ loginError }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }
      .login-card {
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
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/profile']);
      } else {
        this.loginError = 'Invalid username or password.';
      }
    }
  }
}
