import { Component, OnInit } from '@angular/core';

import { RestApiService } from "../rest-api.service";
import { DataService } from "../data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any;

  constructor(
    private api: RestApiService,
    private data: DataService
  ) { }

  async ngOnInit() {
    try {
      const result = await this.api.get('products');

      result['success'] ?
        this.products = result['products'] :
        this.data.errorMessage(result['message']);
    } catch (error) {
      this.data.errorMessage(error['message']);
    }
  }


}
