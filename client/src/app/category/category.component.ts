import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { RestApiService } from "../rest-api.service";
import { DataService } from "../data.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryId: any;
  category: any;
  page = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: RestApiService,
    private data: DataService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.categoryId = res['id'];
      this.getProducts(false);
    })
  }

  get lower() {
    return 10 * (this.page - 1) + 1;
  }

  get upper() {
    return Math.min(10 * this.page, this.category.count);
  }

  async getProducts(event: any) {
    if (event) {
      this.category = null;
    }

    try {
      const result = await this.api.get(`categories/${this.categoryId}?page=${this.page - 1}`);

      result['success'] ?
        this.category = result :
        this.data.errorMessage(result['message']);
    } catch (error) {
      this.data.errorMessage(error['message']);
    }
  }

}
