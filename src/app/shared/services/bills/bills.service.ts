import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { applicationUrls } from '../../url';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  constructor(private http: HttpClient) {}
  getList(payload: any) {
    return this.http.get(applicationUrls.bills + 'list' + payload);
  }
  createBill(data: any) {
    return this.http.post(applicationUrls.bills + 'create', data);
  }
  updateBill(data: any) {
    return this.http.post(applicationUrls.bills + 'update', data);
  }
  getById(id: string) {
    return this.http.get(applicationUrls.bills + 'id/' + id);
  }
  removeProduct(id: number) {
    return this.http.delete(applicationUrls.bills + id);
  }
}
