import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopListEntryComponent } from './stop-list-entry.component';

describe('StopListEntryComponent', () => {
  let component: StopListEntryComponent;
  let fixture: ComponentFixture<StopListEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopListEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopListEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
