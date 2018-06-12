import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  btnDisabled = false;
  currentSettings: any;

  constructor(
    private data: DataService,
    private api: RestApiService
  ) { }

  async ngOnInit() {
    try {
      if (!this.data.user) {
        await this.data.getProfile();
      }

      this.currentSettings = Object.assign({}, {
        newPwd: '',
        pwdConfirm: ''
      }, this.data.user);
    } catch (error) {
      this.data.errorMessage(error);
    }
  }

  validate(settings) {
    if (settings['name']) {
      if (settings['email']) {
        if (settings['newPwd']) {
          if (settings['pwdConfirm']) {
            if (settings['newPwd'] === settings['pwdConfirm']) {
              return true;
            } else {
              this.data.errorMessage('Passwords do not match.');
            }
          } else {
            this.data.errorMessage('Please enter confirmation password.');
          }
        } else {
          if (!settings['pwdConfirm']) {
            return true;
          } else {
            this.data.errorMessage('Please enter new password.');
          }
        }
      } else {
        this.data.errorMessage('Please enter your email.');
      }
    } else {
      this.data.errorMessage('Please enter your name.');
    }
  }

  async update() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.currentSettings)) {
        const data = await this.api.post(
          'accounts/profile',
          {
            name: this.currentSettings['name'],
            email: this.currentSettings['email'],
            password: this.currentSettings['newPwd'],
            isSeller: this.currentSettings['isSeller']
          }
        );

        data['success']
          ? (this.data.getProfile(), this.data.successMessage(data['message']))
          : this.data.errorMessage(data['message']);
      }
    } catch (error) {
      this.data.errorMessage(error['message']);
    }
    this.btnDisabled = false;
  }

}
