import { TestBed, inject } from '@angular/core/testing';

import { AwardSummaryService } from './award-summary.service';

describe('AwardSummaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AwardSummaryService]
    });
  });

  it('should be created', inject([AwardSummaryService], (service: AwardSummaryService) => {
    expect(service).toBeTruthy();
  }));
});
