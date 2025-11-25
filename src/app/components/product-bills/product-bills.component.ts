import { Component, inject, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../../shared/header/header.component';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { BillsService } from '../../shared/services/bills/bills.service';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-bills',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule,
    RouterModule,
    NgbPaginationModule,
  ],
  templateUrl: './product-bills.component.html',
  styleUrl: './product-bills.component.scss',
})
export class ProductBillsComponent {
  searchTerm: any = '';
  billsData: any = [];
  modifyData: any;
  private modalService = inject(NgbModal);
  closeResult = '';
  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  modalReference!: NgbModalRef;
  purchaseData: any = [];
  totalItems: any;
  currentPage: any = 1;
  itemsPerPage: any = 10;
  selectedDate: string = '';
  userRole: any;
  constructor(
    private fb: FormBuilder,
    private billsService: BillsService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*(\\.[0-9]+)?$')],
      ],
    });
    let data = JSON.parse(localStorage.getItem('user') || '');
    this.userRole = data.admin.role;
  }

  ngOnInit() {
    this.getList();
  }
  getList(searchTerm: string = '', selectedDate: string = ''): void {
    this.spinner.show();
    let pageparams;
    pageparams = `?pageSize=${this.itemsPerPage}&pageNumber=${
      this.currentPage ? this.currentPage : 1
    }`;
    if (searchTerm) {
      this.currentPage = 1;
      pageparams = `?pageSize=${this.itemsPerPage}&pageNumber=${
        this.currentPage ? this.currentPage : 1
      }&search=${searchTerm}`;
    }
    if (selectedDate) {
      this.currentPage = 1;
      pageparams = `?pageSize=${this.itemsPerPage}&pageNumber=${
        this.currentPage ? this.currentPage : 1
      }&date=${selectedDate}`;
    }
    this.billsService.getList(pageparams).subscribe(
      (res: any) => {
        this.billsData = res?.data?.bills;
        this.totalItems = res?.data?.pagination?.total;
        this.currentPage = res?.data?.pagination?.page;
        this.spinner.hide();
      },
      (error) => {
        console.error('There was an error!', error);
        this.spinner.hide();
      }
    );
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.getList();
  }
  onSearch(): void {
    this.getList(this.searchTerm, this.selectedDate);
  }
  onDateChange(): void {
    this.getList(this.searchTerm, this.selectedDate);
    this.router.navigate(['/filter-list', this.selectedDate]);
  }
  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    let obj = this.modifyData
      ? { productId: this.modifyData._id, ...this.productForm.value }
      : { ...this.productForm.value };
    this.billsService.createBill(obj).subscribe(
      (res: any) => {
        this.getList();
        this.productForm.reset();
        this.modalService.dismissAll();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  deleteProduct(id: any): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        this.billsService.removeProduct(id).subscribe(
          (res: any) => {
            this.getList();
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }
  editBill(id: any): void {
    this.router.navigate(['/create-bills'], {
      queryParams: { id: id },
    });
  }
}
