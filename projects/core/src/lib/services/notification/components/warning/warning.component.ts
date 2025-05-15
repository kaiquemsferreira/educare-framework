import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Component, Inject, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'lib-warning',
  imports: [],
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss', '../notification-component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WarningComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string },
              private readonly snackBarRef: MatSnackBarRef<WarningComponent>) { }

  public closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
