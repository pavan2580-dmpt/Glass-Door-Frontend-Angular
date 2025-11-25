import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseProductsComponent } from './purchase-products.component';

describe('PurchaseProductsComponent', () => {
  let component: PurchaseProductsComponent;
  let fixture: ComponentFixture<PurchaseProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
