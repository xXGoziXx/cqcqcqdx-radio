import { TestBed } from '@angular/core/testing';

import { UploadAdapterService } from './UploadAdapter.service';

describe('EditorService', () => {
  let service: UploadAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
