import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaSelectionComponent } from './media-selection.component';

describe('MediaSelectionComponent', () => {
  let component: MediaSelectionComponent;
  let fixture: ComponentFixture<MediaSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
