import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userRole: any;
  constructor(private router: Router) {
    let data = JSON.parse(localStorage.getItem('user') || '');
    this.userRole = data.admin.role
  }
  logout():void{
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
