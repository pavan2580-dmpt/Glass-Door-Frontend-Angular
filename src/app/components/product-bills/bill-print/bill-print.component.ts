import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsService } from '../../../shared/services/bills/bills.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-bill-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bill-print.component.html',
  styleUrl: './bill-print.component.scss',
})
export class BillPrintComponent {
  billList: any = [];
  productList: any = [];
  id: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private billsService: BillsService,
    private spinner: NgxSpinnerService
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log('dhdh', this.id);
    if (this.id) {
      this.getbyId(this.id);
    }
  }
  ngOnInit() {}
  getbyId(id: string) {
    this.spinner.show();
    this.billsService.getById(id).subscribe(
      (res: any) => {
        this.billList = res.data.bill;
        this.productList = this.billList.products;
        console.log('productList', this.productList);
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }
  print() {
    window.print();
    // window.resizeTo(800, 600);
  }

  bacK() {
    this.router.navigate(['/product-bills']);
  }
  calculateTotal(): { total: number; tax: number } {
    const total = this.productList?.reduce((sum: any, product: any) => {
      return sum + product?.productId?.price * product.quantity;
    }, 0);

    const tax = total * 0.1;
    return { total, tax };
  }
}
