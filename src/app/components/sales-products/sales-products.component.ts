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
import { SalesService } from '../../shared/services/sales/sales.service';
import { PurchasedService } from '../../shared/services/purchased/purchased.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sales-products',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule,
    NgbPaginationModule,
  ],
  templateUrl: './sales-products.component.html',
  styleUrl: './sales-products.component.scss',
})
export class ProductListComponent {
  searchTerm: string = '';
  productData: any = [];
  modifyData: any;
  private modalService = inject(NgbModal);
  closeResult = '';
  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  modalReference!: NgbModalRef;
  purchaseData: any = [];
  filteredData: any = [];
  totalItems: any;
  currentPage: any = 1;
  itemsPerPage: any = 10;
  error: any;
  searchName: string = '';
  productPrice: any;

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private purchasedService: PurchasedService,
    private spinner: NgxSpinnerService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*(\\.[0-9]+)?$')],
      ],
      productId: [''],
    });
  }
  ngOnInit() {
    this.getList();
    this.getPurchasedList();
  }
  getList(searchTerm: string = ''): void {
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
    this.salesService.getList(pageparams).subscribe(
      (res: any) => {
        this.productData = res?.data?.products;
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
    this.getList(this.searchTerm);
  }

  getPurchasedList(searchName: string = ''): void {
    let pageparams;
    pageparams = `?pageSize=${this.itemsPerPage}&pageNumber=${
      this.currentPage ? this.currentPage : 1
    }`;
    if (searchName) {
      this.currentPage = 1;
      pageparams = `?pageSize=${this.itemsPerPage}&pageNumber=${
        this.currentPage ? this.currentPage : 1
      }&search=${searchName}`;
    }
    this.purchasedService.getList(pageparams).subscribe(
      (res: any) => {
        this.purchaseData = res.data.purchasedBill;
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  onInputChange() {
    this.searchName = this.productForm.get('name')?.value.toLowerCase();
    this.getPurchasedList(this.searchName);
  }
  onProductSelect(product: any) {
    this.productForm.patchValue({
      name: product.productName,
      productId: product._id,
    });
    this.productPrice = product.price
    this.searchName = '';
  }

  open(content: TemplateRef<any>, data?: any) {
    console.log('xdhddh', data);
    this.modifyData = data;
    if (this.modifyData) {
      this.productForm.patchValue(data);
    } else {
      this.productForm.reset();
    }
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.error = '';
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.error = '';
        }
      );
  }

  private getDismissReason(reason: any): string {
    this.filteredData = [];
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    let obj = this.modifyData
      ? {
          id: this.modifyData._id,
          ...(() => {
            let { productId, ...rest } = this.productForm.value;
            return rest;
          })(),
        }
      : {
          ...this.productForm.value,
        };
    if (obj.id || obj.productId) {
      this.salesService.createUpdate(obj).subscribe(
        (res: any) => {
          this.getList();
          this.productForm.reset();
          this.modalService.dismissAll();
          this.filteredData = [];
        },
        (err) => {
          console.log(err);
          this.error = err.error.message;
        }
      );
    } else {
      this.error = 'Product not available';
    }
  }
  deleteProduct(id: any): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        this.salesService.removeProduct(id).subscribe(
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
  validateNumber(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
