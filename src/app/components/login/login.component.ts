import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  productData: any = [
    {
      name: 'Cihpargoi edarg lacidem',
      price: '500',
    },
    {
      name: 'Benton Mens Chronograph Watch 44mm 10 ATM',
      price: '200',
    },
    {
      name: 'Benton Unisex Automatic Watch 40mm 10 ATM',
      price: '300',
    },
    {
      name: 'Benton Unisex Automatic Watch 40mm 10 ATM',
      price: '400',
    },
    {
      name: 'Capmia Mens Chronograph Watch 44mm 10 ATM',
      price: '200',
    },
    {
      name: 'Benton Unisex Automatic Watch 40mm 10 ATM',
      price: '100',
    },
    {
      name: 'Benton Unisex Automatic Watch 40mm 10 ATM',
      price: '600',
    },
    {
      name: 'Capmia Mens Chronograph Watch 44mm 10 ATM',
      price: '800',
    },
  ];

  loginForm!: FormGroup;
  error: any;
  passwordVisible: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService:AuthService
  ) {}
  
  ngOnInit() {
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.spinner.show();
    this.authService.login(this.loginForm.value).subscribe(
      (res: any) => {
        this.spinner.hide();
        localStorage.setItem('authToken', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        this.router.navigate(['/sales-products']);
      },
      (err) => {
        this.error = err.error.message;
        this.spinner.hide();
      }
    );

    // if (
    //   this.loginForm.value.userName === 'admin' &&
    //   this.loginForm.value.userName === 'admin'
    // ) {
    //   sessionStorage.setItem('data', JSON.stringify(this.productData));
    //   localStorage.setItem('authToken', JSON.stringify(this.productData));
    //   this.router.navigate(['/products']);
    //   this.error = false;
    // } else {
    //   this.loginForm.markAllAsTouched();
    //   this.error = true;
    // }
  }
}
