import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberShipEditComponent } from './member-ship-edit.component';

describe('MemberShipEditComponent', () => {
  let component: MemberShipEditComponent;
  let fixture: ComponentFixture<MemberShipEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberShipEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberShipEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
