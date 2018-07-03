import { Component, OnInit } from '@angular/core';

import { DataService } from "../data.service";
import { RestApiService } from "../rest-api.service";
import {P} from "@angular/core/src/render3";

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {
  products: any;

  constructor(
    private data: DataService,
    private api: RestApiService
  ) { }

  async ngOnInit() {
    try {
      const result = await this.api.get('seller/products');

      result['success'] ?
        this.products = result['products'] :
        this.data.errorMessage(result['message']);
    } catch (error) {
      this.data.errorMessage(error['message']);
    }
  }

}
