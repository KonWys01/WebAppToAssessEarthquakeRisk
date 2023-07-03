import { Component, Input } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Input() hasBackdrop: any;
  panelOpenState = false;
  constructor(public dialog: MatDialog) {}
  openDialog(): void {
    this.dialog.open(DialogDataExampleDialog, {
      data: {
        animal: 'panda',
      },
    });
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
  standalone: true,
  imports: [MatDialogModule],
})
export class DialogDataExampleDialog {
  // constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
