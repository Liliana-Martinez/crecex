import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  private accessDeniedSubject = new BehaviorSubject<boolean>(false);
  accessDenied$ = this.accessDeniedSubject.asObservable();

  showAccesDeniedModal() {
    this.accessDeniedSubject.next(true);
  }

  clearAccessDeniedFlag() {
    this.accessDeniedSubject.next(false);
  }
}
