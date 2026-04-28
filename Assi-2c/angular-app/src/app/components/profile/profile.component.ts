import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface User {
  username: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-wrapper">
      <div class="profile-card">
        <h2>Profile</h2>
        <div *ngIf="user" class="user-info">
          <div class="info-item"><strong>Username:</strong> {{ user.username }}</div>
          <div class="info-item"><strong>Email:</strong> {{ user.email }}</div>
        </div>
        <button (click)="logout()" class="btn btn-danger">Logout</button>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }
      .profile-card {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
      h2 {
        margin-bottom: 30px;
        color: #333;
      }
      .user-info {
        margin-bottom: 30px;
      }
      .info-item {
        margin-bottom: 15px;
        text-align: left;
      }
      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .btn-danger {
        background-color: #dc3545;
        color: white;
      }
      .btn-danger:hover {
        background-color: #c82333;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
