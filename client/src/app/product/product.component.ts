import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RestApiService } from "../rest-api.service";
import { DataService } from "../data.service";
import {P} from "@angular/core/src/render3";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: any;
  myReview = {
    title: '',
    description: '',
    rating: 0
  };
  btnDisabled = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.api.get(`product/${res['id']}`)
        .then(result => result['success'] ?
          this.product = result['product'] :
          this.router.navigate(['/'])
        ).catch(error => this.data.errorMessage(error['message']));
    })
  }

  async postReview() {
    this.btnDisabled = true;

    try {
      const result = await this.api.post('product/review', {
        ...this.myReview,
        productId: this.product._id
      });

      result['success'] ?
        this.data.successMessage(result['message']) :
        this.data.errorMessage(result['message']);
    } catch(error) {
      this.data.errorMessage(error['message']);
    }

    this.btnDisabled = false;
  }

}
