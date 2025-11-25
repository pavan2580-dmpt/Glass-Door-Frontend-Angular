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
import { PurchasedService } from '../../shared/services/purchased/purchased.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase-products',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    CommonModule,
    NgbPaginationModule,
  ],
  templateUrl: './purchase-products.component.html',
  styleUrl: './purchase-products.component.scss',
})
export class PurchaseProductsComponent {
  searchTerm: string = '';
  productData: any = [];
  modifyData: any;
  private modalService = inject(NgbModal);
  closeResult = '';
  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  modalReference!: NgbModalRef;
  totalItems: any;
  currentPage: any = 1;
  itemsPerPage: any = 10;
  error: any;
  extraQty: any;

  constructor(
    private fb: FormBuilder,
    private purchasedService: PurchasedService,
    private spinner: NgxSpinnerService
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3)]],
      quantity: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*(\\.[0-9]+)?$')],
      ],
      price: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*(\\.[0-9]+)?$')],
      ],
    });
  }
  ngOnInit() {
    this.getList();
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
    this.purchasedService.getList(pageparams).subscribe(
      (res: any) => {
        if (res) {
          this.productData = res?.data?.purchasedBill;
          this.spinner.hide();
          this.totalItems = res?.data?.pagination?.total;
          this.currentPage = res?.data?.pagination?.page;
        }
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
  open(content: TemplateRef<any>, data?: any) {
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
    let obj;
    if (this.modifyData) {
      if (this.extraQty) {
        this.productForm.value.quantity += +this.extraQty;
      }
      obj = {
        purchasedId: this.modifyData._id,
        ...this.productForm.value,
      };
    } else {
      obj = {
        ...this.productForm.value,
      };
    }
    this.purchasedService.createUpdate(obj).subscribe(
      (res: any) => {
        this.getList();
        this.productForm.reset();
        this.modalService.dismissAll();
        this.error = '';
        this.extraQty = 0;
      },
      (err) => {
        this.error = err.error.message;
        console.log(err.error.message);
      }
    );
  }
  deleteProduct(id: any): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        this.purchasedService.removeProduct(id).subscribe(
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
