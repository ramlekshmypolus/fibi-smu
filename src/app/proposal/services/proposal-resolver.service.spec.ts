import { TestBed, inject } from '@angular/core/testing';

import { ProposalResolverService } from './proposal-resolver.service';

describe('ProposalResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProposalResolverService]
    });
  });

  it('should be created', inject([ProposalResolverService], (service: ProposalResolverService) => {
    expect(service).toBeTruthy();
  }));
});
