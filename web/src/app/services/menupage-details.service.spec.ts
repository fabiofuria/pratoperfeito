import { TestBed } from '@angular/core/testing';

import { MenupageDetailsService } from './menupage-details.service';

describe('MenupageDetailsService', () => {
  let service: MenupageDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenupageDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
