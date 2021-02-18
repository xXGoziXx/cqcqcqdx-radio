import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCommandsComponent } from './custom-commands.component';

describe('CustomCommandsComponent', () => {
  let component: CustomCommandsComponent;
  let fixture: ComponentFixture<CustomCommandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCommandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
