import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { applicationUrls } from '../../url';

@Injectable({
  providedIn: 'root',
})
export class PurchasedService {
  constructor(private http: HttpClient) {}
  getList(payload: any) {
    return this.http.get(applicationUrls.purchased + 'list' +  payload);
  }
  createUpdate(data: any) {
    return this.http.post(applicationUrls.purchased + 'createUpdate', data);
  }
  getById(id: number) {
    return this.http.get(applicationUrls.purchased + 'id/' + id);
  }
  removeProduct(id: number) {
    return this.http.delete(applicationUrls.purchased + id);
  }
}
