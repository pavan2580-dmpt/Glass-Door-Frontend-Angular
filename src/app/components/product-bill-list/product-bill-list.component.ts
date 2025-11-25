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
import { SharingService } from '../../shared/services/sharing/sharing.service';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { BillsService } from '../../shared/services/bills/bills.service';

@Component({
  selector: 'app-product-bill-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HeaderComponent, CommonModule],
  templateUrl: './product-bill-list.component.html',
  styleUrl: './product-bill-list.component.scss',
})
export class ProductBillListComponent {
  searchTerm: string = '';
  productData: any = [];
  modifyData: any;

  private modalService = inject(NgbModal);
  closeResult = '';
  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  modalReference!: NgbModalRef;
  purchaseData: any = [];
  constructor(
    private fb: FormBuilder,
    private sharingService: SharingService,
    private billsService: BillsService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*(\\.[0-9]+)?$')],
      ],
    });
  }
  ngOnInit() {
    this.getList();
  }
  getList(): void {
    this.billsService.getList().subscribe(
      (res: any) => {
        console.log("hdhh", res)
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }
  get filteredProducts() {
    return this.productData.filter((product: any) =>
      product.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    let obj;
    if (this.modifyData) {
      obj = {
        productId: this.modifyData._id,
        ...this.productForm.value,
      };
    } else {
      obj = {
        ...this.productForm.value,
      };
    }
    this.sharingService.createProduct(obj).subscribe(
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
        this.sharingService.removeProduct(id).subscribe(
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
  openModal():void{

  }
}
