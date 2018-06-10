import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(
    private http: HttpClient
  ) {}

  getHeaders() {
    const token = localStorage.getItem('token');

    return token ? new HttpHeaders().set('Authorization', token) : null;
  }

  get(url: string) {
    return this.http.get(`${environment.apiUrl}/${url}`, { headers: this.getHeaders() }).toPromise();
  }

  post(url: string, body: any) {
    return this.http.post(`${environment.apiUrl}/${url}`, body, { headers: this.getHeaders() }).toPromise();
  }
}
