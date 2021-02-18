import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartExComponent } from './part-ex.component';

describe('PartExComponent', () => {
  let component: PartExComponent;
  let fixture: ComponentFixture<PartExComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartExComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
