import { TestBed } from '@angular/core/testing';

import { FsocietyService } from './fsociety.service';

describe('FsocietyService', () => {
  let service: FsocietyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FsocietyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
