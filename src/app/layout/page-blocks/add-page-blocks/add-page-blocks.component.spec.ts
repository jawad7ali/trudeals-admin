import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPageBlocksComponent } from './add-page-blocks.component';

describe('AddPageBlocksComponent', () => {
  let component: AddPageBlocksComponent;
  let fixture: ComponentFixture<AddPageBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPageBlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPageBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
