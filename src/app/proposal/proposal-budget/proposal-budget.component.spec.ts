import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalBudgetComponent } from './proposal-budget.component';

describe('ProposalBudgetComponent', () => {
  let component: ProposalBudgetComponent;
  let fixture: ComponentFixture<ProposalBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
