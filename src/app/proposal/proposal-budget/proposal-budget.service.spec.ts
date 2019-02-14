import { TestBed, inject } from '@angular/core/testing';

import { ProposalBudgetService } from './proposal-budget.service';

describe('ProposalBudgetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProposalBudgetService]
    });
  });

  it('should be created', inject([ProposalBudgetService], (service: ProposalBudgetService) => {
    expect(service).toBeTruthy();
  }));
});
