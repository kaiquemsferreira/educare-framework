import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'lib-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string },
              private readonly snackBarRef: MatSnackBarRef<SuccessComponent>) { }

  public closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
