import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbarContentSubject: Subject<string> = new Subject<string>();
  snackbarContent$ = this.snackbarContentSubject.asObservable();
  constructor() {}

  updateSnackbarContent(content: string): void {
    this.snackbarContentSubject.next(content);
  }
}
