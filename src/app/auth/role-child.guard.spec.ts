import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { roleChildGuard } from './role-child.guard';

describe('roleChildGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleChildGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
