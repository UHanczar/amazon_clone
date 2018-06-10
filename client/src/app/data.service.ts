import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  message = '';
  messageType = 'danger';
  user: any;

  constructor(
    private router: Router
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
}
