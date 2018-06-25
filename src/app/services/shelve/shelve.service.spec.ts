import { TestBed, inject } from '@angular/core/testing';

import { ShelveService } from './shelve.service';

describe('ShelveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShelveService]
    });
  });

  it('should be created', inject([ShelveService], (service: ShelveService) => {
    expect(service).toBeTruthy();
  }));
});
