import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  btnDisabled = false;

  constructor(
    private router: Router,
    private api: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() {
  }

  validate() {
    if (this.email) {
      if (this.password) {
        return true;
      } else {
        this.data.errorMessage('Password is not entered.');
      }
    } else {
      this.data.errorMessage('Email is not entered.');
    }
  }

  async login() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        const data = await this.api.post('accounts/login', {
          email: this.email,
          password: this.password
        });

        if (data['success']) {
          localStorage.setItem('token', data['token']);
          await this.data.getProfile();
          this.router.navigate(['/']);
        } else {
          this.data.errorMessage(data['message']);
        }
      }
    } catch(error) {
      this.data.errorMessage(error);
    }

    this.btnDisabled = false;
  }
}
