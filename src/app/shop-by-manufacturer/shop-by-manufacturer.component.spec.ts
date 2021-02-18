import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopByManufacturerComponent } from './shop-by-manufacturer.component';

describe('ShopByManufacturerComponent', () => {
  let component: ShopByManufacturerComponent;
  let fixture: ComponentFixture<ShopByManufacturerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopByManufacturerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopByManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
