import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RestApiService } from "../rest-api.service";
import { DataService } from "../data.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: any;

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

}
