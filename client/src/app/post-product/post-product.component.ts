import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";

import { DataService } from "../data.service";
import { RestApiService } from "../rest-api.service";

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent implements OnInit {
  product = {
    title: '',
    price: 0,
    categoryId: '',
    description: '',
    product_picture: null
  };
  categories: any;
  btnDisabled = false;

  constructor(
    private router: Router,
    private api: RestApiService,
    private data: DataService
  ) { }

  async ngOnInit() {
    try {
      const result = await this.api.get('categories');

      result['success'] ?
        this.categories = result['categories'] :
        this.data.errorMessage(result['message']);
    } catch (error) {
      this.data.errorMessage(error['message']);
    }
  }

  validate(product) {
    if (product.title) {
      if (product.price) {
        if (product.categoryId) {
          if (product.description) {
            if (product.product_picture) {
              return true;
            } else {
              this.data.errorMessage('Please select product image.');
            }
          } else {
            this.data.errorMessage('Please enter description.');
          }
        } else {
          this.data.errorMessage('Please select category.');
        }
      } else {
        this.data.errorMessage('Please enter a price.');
      }
    } else {
      this.data.errorMessage('Please enter a title.');
    }
  }

  fileChange(event: any) {
    this.product.product_picture = event.target.files[0];
  }

  async addNewProduct() {
    this.btnDisabled = true;

    try {
      if (this.validate(this.product)) {
        const form = new FormData();

        for (let key in this.product) {
          if (key === 'product_picture') {
            form.append('product_picture', this.product.product_picture, this.product.product_picture.name);
          } else {
            form.append(key, this.product[key]);
          }
        }

        const result = await this.api.post('seller/products', form);

        result['success'] ?
          this.router.navigate(['/profile/myproducts'])
            .then(() => this.data.successMessage(result['message']))
            .catch(error => this.data.errorMessage(error)) :
          this.data.errorMessage(result['message']);
      }
    } catch (error) {
      this.data.errorMessage(error['message']);
    }

    this.btnDisabled = false;
  }
}
