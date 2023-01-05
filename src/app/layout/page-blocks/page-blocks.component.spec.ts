import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBlocksComponent } from './page-blocks.component';

describe('PageBlocksComponent', () => {
  let component: PageBlocksComponent;
  let fixture: ComponentFixture<PageBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
