import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassswordComponent } from './forgotPassword.component';

describe('ForgotPassswordComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<ForgotPassswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPassswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPassswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
