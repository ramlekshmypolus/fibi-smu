import { TestBed, inject } from '@angular/core/testing';

import { GrantResolverService } from './grant-resolver.service';

describe('GrantResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrantResolverService]
    });
  });

  it('should be created', inject([GrantResolverService], (service: GrantResolverService) => {
    expect(service).toBeTruthy();
  }));
});
