import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  message = '';
  messageType = 'danger';
  user: any;

  constructor(
    private router: Router,
    private api: RestApiService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.message = '';
      }
    });
  }

  errorMessage(message) {
    this.messageType = 'danger';
    this.message = message;
  }

  successMessage(message) {
    this.messageType = 'success';
    this.message = message;
  }

  warningMessage(message) {
    this.messageType = 'warning';
    this.message = message;
  }

  async getProfile() {
    try {
      if (localStorage.getItem('token')) {
        const data = await this.api.get('accounts/profile');

        this.user = data['user'];
      }
    } catch (error) {
      this.errorMessage(error['message']);
    }
  }
}
