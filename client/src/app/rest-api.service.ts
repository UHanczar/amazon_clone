import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(
    private http: HttpClient
  ) { }

  get(url: string) {
    return this.http.get(url).toPromise();
  }

  post(url: string, body: any) {
    return this.http.post(url, body).toPromise();
  }
}
