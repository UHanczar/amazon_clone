import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  searchTerm = '';
  isCollapsed = true;

  constructor(
    private router: Router,
    private data: DataService
  ) {}

  ngOnInit() {
    this.data.getProfile();
  }

  get token() {
    return localStorage.getItem('token');
  }

  collapse() {
    this.isCollapsed = true;
  }

  closeDropdown(dropdown) {
    dropdown.close();
  }

  logout() {
    this.data.user = {};
    localStorage.clear();
    this.router.navigate(['']);
  }

  search() {}
}
