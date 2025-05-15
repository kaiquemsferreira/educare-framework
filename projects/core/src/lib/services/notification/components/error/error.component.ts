import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'lib-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string },
              private readonly snackBarRef: MatSnackBarRef<ErrorComponent>) { }

  public closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
