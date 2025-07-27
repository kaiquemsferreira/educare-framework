import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';

import { NotificationDataModel } from '../../../models/notification/notification-data.model';

@Component({
  selector: 'success-notification',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './success.component.html',
  styleUrls: [
    './success.component.scss',
    '../notification-component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class SuccessComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: NotificationDataModel,
              private readonly snackBarRef: MatSnackBarRef<SuccessComponent>) { }

  public closeSnackbar(): void {
    this.snackBarRef.dismiss();
  }
}
