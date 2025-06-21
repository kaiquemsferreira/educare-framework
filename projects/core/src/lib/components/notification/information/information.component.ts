import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { NotificationDataModel } from '../../../models/notification/notification-data.model';

@Component({
  selector: 'information-notification',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss', '../notification-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InformationComponent {
  public animationDuration = 5000;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: NotificationDataModel,
              private readonly snackBarRef: MatSnackBarRef<InformationComponent>) {
    this.animationDuration = data.duration ?? 5000;
  }

  public closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
