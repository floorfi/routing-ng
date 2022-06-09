import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TButtonComponent } from './t-button.component';

describe('TButtonComponent', () => {
  let component: TButtonComponent;
  let fixture: ComponentFixture<TButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
