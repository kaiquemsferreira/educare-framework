import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { NgIf, NgStyle } from "@angular/common";
import { NotificationDataModel } from '../../../models/notification/notification-data.model';

@Component({
  selector: 'error-notification',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss', '../notification-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: NotificationDataModel,
              private readonly snackBarRef: MatSnackBarRef<ErrorComponent>) { }

  public closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
