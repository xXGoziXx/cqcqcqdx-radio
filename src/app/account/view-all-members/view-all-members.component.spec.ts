import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllMembersComponent } from './view-all-members.component';

describe('ViewAllMembersComponent', () => {
  let component: ViewAllMembersComponent;
  let fixture: ComponentFixture<ViewAllMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
