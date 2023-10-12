import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationLogementComponent } from './presentation-logement.component';

describe('PresentationLogementComponent', () => {
  let component: PresentationLogementComponent;
  let fixture: ComponentFixture<PresentationLogementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PresentationLogementComponent]
    });
    fixture = TestBed.createComponent(PresentationLogementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
