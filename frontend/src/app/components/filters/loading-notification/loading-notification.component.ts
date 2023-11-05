import { Component, OnInit } from '@angular/core';

import { MatSnackBarRef } from '@angular/material/snack-bar';

import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-loading-notification',
  templateUrl: './loading-notification.component.html',
  styleUrls: ['./loading-notification.component.scss'],
})
export class LoadingNotificationComponent implements OnInit {
  isLoaded: boolean = false;
  proggresValue: number = 0;
  constructor(
    private snackBarRef: MatSnackBarRef<LoadingNotificationComponent>,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.snackbarService.snackbarContent$.subscribe((content) => {
      if (content === 'loaded') {
        this.isLoaded = true;
        const interval = setInterval(() => {
          if (this.proggresValue === 100) {
            clearInterval(interval);
          } else {
            this.proggresValue += 10;
          }
        }, 10);
      }
    });
  }
}
