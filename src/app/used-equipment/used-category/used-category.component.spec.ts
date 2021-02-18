import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedCategoryComponent } from './used-category.component';

describe('UsedCategoryComponent', () => {
  let component: UsedCategoryComponent;
  let fixture: ComponentFixture<UsedCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsedCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsedCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
