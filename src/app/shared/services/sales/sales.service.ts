import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { applicationUrls } from '../../url';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  constructor(private http: HttpClient) {}
  getList(payload:any) {
    return this.http.get(applicationUrls.sales + 'list' + payload);
  }
  createUpdate(data: any) {
    return this.http.post(applicationUrls.sales + 'createUpdate', data);
  }
  getById(id: number) {
    return this.http.get(applicationUrls.sales + 'id/' + id);
  }
  removeProduct(id: number) {
    return this.http.delete(applicationUrls.sales + id);
  }
}
