import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsService } from '../../../shared/services/bills/bills.service';

@Component({
  selector: 'app-filter-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-list.component.html',
  styleUrl: './filter-list.component.scss',
})
export class FilterListComponent {
  id: any;
  billsData: any = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.getList(this.id);
    }
  }
  getList(selectedDate: any): void {
    let pageparams;
    if (selectedDate) {
      pageparams = `?date=${selectedDate}`;
    }
    this.billsService.getList(pageparams).subscribe(
      (res: any) => {
        this.billsData = res?.data?.bills;
        console.log('ddgfg', this.billsData);
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }
  print() {
    window.print();
  }

  bacK() {
    this.router.navigate(['/product-bills']);
  }
  getTotalAmount(): number {
    return this.billsData.reduce((acc: any, bill: any) => acc + bill.total, 0);
  }
}
