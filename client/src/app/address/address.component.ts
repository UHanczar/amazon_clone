import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  btnDisabled = false;

  currentAddress: any;

  constructor(
    private api: RestApiService,
    private data: DataService
  ) { }

  async ngOnInit() {
    try {
      const data = await this.api.get('accounts/address');

      if (JSON.stringify(data['address']) === '{}' && this.data.message === '') {
        this.data.warningMessage('You have not entered your shipping address. Please, enter your shipping address.');
      }

      this.currentAddress = data['address'];
    } catch (error) {
      this.data.errorMessage(error['message']);
    }
  }

  async updateAddress() {
    this.btnDisabled = true;

    try {
      const res = await this.api.post('accounts/address', this.currentAddress);

      res['success'] ?
        (this.data.successMessage(res['message']), await this.data.getProfile()) :
        this.data.errorMessage(res['message']);
    } catch (error) {
      this.data.errorMessage(error('message'));
    }
  }
}
