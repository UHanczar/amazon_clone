import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { DataService } from "../data.service";
import { RestApiService } from "../rest-api.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  query: string;
  content: any;

  page = 1;


  constructor(
    private activatedRoute: ActivatedRoute,
    private data: DataService,
    private api: RestApiService
  ) { }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(res => {
        this.query = res['query'];
        this.page = 1;
        this.getProducts();
      });
  }

  get lower() {
    return 1 + this.content.hitsPerPage * this.content.page;
  }

  get upper() {
    return Math.min(
      this.content.hitsPerPage * (this.content.page + 1),
      this.content.nbHits,
    );
  }

  async getProducts() {
    this.content = null;
    try {
      const data = await this.api.get(
        `search?query=${this.query}&page=${this.page -
        1}`,
      );
      data['success']
        ? (this.content = data['content'])
        : this.data.errorMessage(data['message']);
    } catch (error) {
      this.data.errorMessage(error['message']);
    }
  }

}
