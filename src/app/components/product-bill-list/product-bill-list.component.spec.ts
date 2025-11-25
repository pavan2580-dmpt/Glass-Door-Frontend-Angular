import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBillListComponent } from './product-bill-list.component';

describe('ProductBillListComponent', () => {
  let component: ProductBillListComponent;
  let fixture: ComponentFixture<ProductBillListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductBillListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
