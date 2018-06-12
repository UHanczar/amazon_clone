import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  name = '';
  email = '';
  password = '';
  passwordToMatch = '';
  isSeller = false;

  btnDisabled = false;

  constructor(
    private router: Router,
    private api: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() {
  }

  validate() {
    if (this.name) {
      if (this.email) {
        if (this.password) {
          if (this.passwordToMatch) {
            if (this.password === this.passwordToMatch) {
              return true;
            } else {
              this.data.errorMessage('Passwords do not match.');
            }
          } else {
            this.data.errorMessage('Confirmation Password is not entered');
          }
        } else {
          this.data.errorMessage('Password is not entered');
        }
      } else {
        this.data.errorMessage('Email is not entered.');
      }
    } else {
      this.data.errorMessage('Name is not entered.');
    }
  }

  async register() {
    this.btnDisabled = true;

    try {
      if (this.validate()) {
        const data = await this.api.post('accounts/signup', {
          name: this.name,
          email: this.email,
          password: this.password,
          isSeller: this.isSeller
        });

        if (data['success']) {
          localStorage.setItem('token', data['token']);
          await this.data.getProfile();

          this.router.navigate(['profile/address'])
            .then(() => this.data.successMessage('Registration successful'))
            .catch(error => this.data.errorMessage(error));
        } else {
          this.data.errorMessage(data['message']);
        }
      }
    } catch(error) {
      this.data.errorMessage(error['message']);
    }

    this.btnDisabled = false;
  }
}
