import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

import { ErrorComponent } from './components/error/error.component';
import { SuccessComponent } from './components/success/success.component';
import { WarningComponent } from './components/warning/warning.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly snackBar: MatSnackBar) { }

  public showNotification(message: string, component: any, panelClass: string): void {
    this.snackBar.openFromComponent(component, {
      data: { message },
      duration: 5000,
      panelClass: [panelClass]
    });
  }

  public success(message: string): void {
    this.showNotification(message, SuccessComponent, 'success-snackbar');
  }

  public warning(message: string): void {
    this.showNotification(message, WarningComponent, 'warning-snackbar');
  }

  public error(message: string): void {
    this.showNotification(message, ErrorComponent, 'error-snackbar');
  }
}
