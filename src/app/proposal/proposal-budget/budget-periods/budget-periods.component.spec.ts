import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetPeriodsComponent } from './budget-periods.component';

describe('BudgetPeriodsComponent', () => {
  let component: BudgetPeriodsComponent;
  let fixture: ComponentFixture<BudgetPeriodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetPeriodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
