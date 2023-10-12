import { TestBed } from '@angular/core/testing';

import { GetAccommodationsService } from './get-accommodations.service';

describe('GetAccommodationsService', () => {
  let service: GetAccommodationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAccommodationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
