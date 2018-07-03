import { Component, OnInit } from '@angular/core';

import { RestApiService} from "../rest-api.service";
import { DataService } from "../data.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any;
  newCategory = '';
  btnDisabled = false;

  constructor(
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

  async addNewCategory() {
    this.btnDisabled = true;
    try {
      const result = await this.api.post('categories',
        { name: this.newCategory});

      result['success'] ?
        this.data.successMessage(result['message']) :
        this.data.errorMessage(result['message']);
    } catch (error) {
      this.data.errorMessage(error['message']);
    }

    this.btnDisabled = false;
  }

}
