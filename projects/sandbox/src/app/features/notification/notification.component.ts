import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Component } from '@angular/core';

import { InformationComponent } from '../../../../../core/src/lib/components/notification/information/information.component';
import { SuccessComponent } from '../../../../../core/src/lib/components/notification/success/success.component';
import { WarningComponent } from '../../../../../core/src/lib/components/notification/warning/warning.component';
import { ErrorComponent } from '../../../../../core/src/lib/components/notification/error/error.component';


@Component({
  selector: 'notification-service-component',
  standalone: true,
  imports: [
    InformationComponent,
    SuccessComponent,
    WarningComponent,
    ErrorComponent
  ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [
    {
      provide: MAT_SNACK_BAR_DATA, useValue: {
        title: 'Example',
        message: 'Notification Example.',
        link: 'https://test/test',
        linkText: 'Further analysis here.',
        closeButton: 'close'
    }
    },
    { provide: MatSnackBarRef,
      useValue: {
      dismiss: () => {}
    }
    }
  ]
})
export class NotificationComponent {

}
