import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2 } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BillsService } from '../../../shared/services/bills/bills.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SalesService } from '../../../shared/services/sales/sales.service';
import { PurchasedService } from '../../../shared/services/purchased/purchased.service';

@Component({
  selector: 'app-create-bill',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './create-bill.component.html',
  styleUrl: './create-bill.component.scss',
})
export class CreateBillComponent {
  productForm!: FormGroup;
  cashBill: boolean = false;
  productData: any = [];
  filterProductData: any = [];
  productsData: any = [];
  billList: any = [];
  filteredData: any[][] = [];
  id: any;
  error: any;
  currentPage: any = 1;
  itemsPerPage: any = 10;
  searchTerm: string = '';
  stockQty: any;
  salesProducts: any = [];
  isReadonly: boolean[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private billsService: BillsService,
    private spinner: NgxSpinnerService,
    private salesService: SalesService
  ) {}
  ngOnInit() {
    this.productForm = this.fb.group({
      customerName: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      city: ['', [Validators.required]],
      products: this.fb.array([this.createProduct()]),
    });
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.getById(this.id);
      }
    });
    this.getList();
  }
  getList(searchTerm: string = '', index: any = ''): void {
    let pageparams;
    pageparams = `?pageSize=${this.itemsPerPage}&pageNumber=${
      this.currentPage ? this.currentPage : 1
    }`;
    if (searchTerm) {
      pageparams = `?pageSize=${this.itemsPerPage}&pageNumber=${
        this.currentPage ? this.currentPage : 1
      }&search=${searchTerm}`;
    }
    this.salesService.getList(pageparams).subscribe(
      (res: any) => {
        this.productData[index] = res.data.products;
        this.salesProducts = res.data.products;
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }
  getById(id: any) {
    this.spinner.show();
    this.billsService.getById(id).subscribe(
      (res: any) => {
        let data = res.data.bill;
        this.billList = res.data.bill.products;
        this.billList.forEach((element: any, i: any) => {
          const productFormGroup = this.products.at(i);
          this.addProduct();
          this.productForm.get('customerName')?.setValue(data.customerName);
          this.productForm.get('phoneNumber')?.setValue(data.phoneNumber);
          this.productForm.get('city')?.setValue(data.city);
          if (element?.productId?.delete) {
            productFormGroup.get('quantity')?.disable();
            productFormGroup.get('name')?.disable();
            productFormGroup.get('price')?.disable();
          }
          this.products.at(i).patchValue({
            name: element?.productId?.name,
            price: element?.productId?.price,
            quantity: element?.quantity,
            productId: element?.productId?._id,
          });
        });
        if (this.products.length > 0) {
          this.products.removeAt(this.products.length - 1);
        }

        this.spinner.hide();
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  createProduct(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      productId: [''],
    });
  }
  get products(): FormArray {
    return this.productForm.get('products') as FormArray;
  }

  addProduct(): void {
    this.products.push(this.createProduct());
    const filteredProducts = this.productData.filter(
      (product: any) =>
        !this.products.value.some(
          (selected: any) => selected.productId === product._id
        )
    );
    this.productData = filteredProducts;
  }
  removeProduct(index: number, item: any): void {
    this.products.removeAt(index);
    this.productData = this.filterProductData;
    this.filteredData = [];
  }

  calculateTotal(): { total: number; tax: number } {
    const total = this.productsData.reduce((sum: any, product: any) => {
      return sum + parseFloat(product.price) * product.qty;
    }, 0);

    const tax = total * 0.1;
    return { total, tax };
  }
  onInputChange(index: number) {
    this.searchTerm = this.products.at(index).get('name')?.value.toLowerCase();
    this.getList(this.searchTerm, index);
  }

  onProductSelect(product: any, index: number) {
    this.products.at(index).patchValue({
      name: product.name,
      price: product.price,
      productId: product._id,
    });
    // const productQuantity: any = product.quantity;
    // this.stockQty = product.quantity;
    // const quantityControl: any = this.products.at(index).get('quantity');
    // quantityControl.clearValidators();
    // quantityControl.setValidators([
    //   Validators.required,
    //   Validators.min(1),
    //   this.quantityValidator(productQuantity),
    // ]);
    // quantityControl.updateValueAndValidity();
    this.searchTerm = '';
    this.productData[index] = [];
  }

  onQtyChange(product: any, i: any) {
    console.log('sdhhh', product);
    const productId = product?.value?.productId;
    const filterData = this.salesProducts.find(
      (item: any) => item._id === productId
    );
    const currentData = this.billList.find(
      (list: any) => list?.productId?._id === productId
    );
    if (currentData) {
      this.stockQty = currentData?.quantity + filterData?.quantity;
    } else {
      this.stockQty = filterData?.quantity;
    }
    const productQuantity: any = this.stockQty;
    const quantityControl: any = this.products.at(i).get('quantity');
    quantityControl.clearValidators();
    quantityControl.setValidators([
      Validators.required,
      Validators.min(1),
      this.quantityValidator(productQuantity),
    ]);
    quantityControl.updateValueAndValidity();
  }
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const formValues = this.productForm.getRawValue();
    let obj;
    if (this.id) {
      const total = formValues?.products.reduce((sum: number, product: any) => {
        return sum + (product?.price * product?.quantity || 0);
      }, 0);
      obj = {
        billId: this.id,
        ...formValues,
        total: total,
      };
      this.spinner.show();
      this.billsService.updateBill(obj).subscribe(
        (res: any) => {
          this.router.navigate(['/bill-print', res.data.bill._id]);
          this.spinner.hide();
        },
        (err) => {
          console.log(err);
          this.spinner.hide();
          this.error = err.error.message;
        }
      );
    } else {
      const total = this.products.value.reduce((sum: number, product: any) => {
        return sum + (product?.price * product?.quantity || 0);
      }, 0);

      obj = {
        total: total,
        ...this.productForm.value,
      };
      this.spinner.show();
      this.billsService.createBill(obj).subscribe(
        (res: any) => {
          this.router.navigate(['/bill-print', res.data.bill._id]);
          this.spinner.hide();
        },
        (err) => {
          console.log(err);
          this.spinner.hide();
          this.error = err.error.message;
        }
      );
    }
  }

  quantityValidator(maxQuantity: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const enteredQuantity = control.value;
      return enteredQuantity > maxQuantity ? { quantityExceeds: true } : null;
    };
  }
}
