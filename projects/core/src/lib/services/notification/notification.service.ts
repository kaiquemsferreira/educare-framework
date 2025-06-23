import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

import { ErrorComponent } from '../../components/notification/error/error.component';
import { SuccessComponent } from '../../components/notification/success/success.component';
import { WarningComponent } from '../../components/notification/warning/warning.component';
import { InformationComponent } from '../../components/notification/information/information.component';
import { NotificationDataModel } from '../../models/notification/notification-data.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly snackBar: MatSnackBar) { }

  public showNotification(data: NotificationDataModel, component: any, panelClass: string): void {
    this.snackBar.openFromComponent(component, {
      data,
      duration: data.duration ?? 5000,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  public success(data: NotificationDataModel): void {
    this.showNotification(data, SuccessComponent, 'success-snackbar');
  }

  public warning(data: NotificationDataModel): void {
    this.showNotification(data, WarningComponent, 'warning-snackbar');
  }

  public error(data: NotificationDataModel): void {
    this.showNotification(data, ErrorComponent, 'error-snackbar');
  }

  public info(data: NotificationDataModel): void {
    this.showNotification(data, InformationComponent, 'info-snackbar')
  }
}
