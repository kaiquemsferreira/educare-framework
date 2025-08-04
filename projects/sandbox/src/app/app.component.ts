import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

import { EducareSvgComponent } from './shared/components/educare-svg/educare-svg.component';
import { NotificationComponent } from './features/notification/notification.component';
import { RadioButtonComponent } from '../../../core/src/lib/components/radio-button/radio-button.component';
import { version } from '../../../core/src/lib/config/version';
import {
  MultiOptionSelectComponent
} from '../../../core/src/lib/components/multi-option-select/multi-option-select.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    EducareSvgComponent,
    NgIf,
    NotificationComponent,
    RadioButtonComponent,
    MultiOptionSelectComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  frameworkVersion = version;
  darkTheme: boolean = true;

  ngOnInit(): void {
    const currentTheme = document.body.getAttribute('data-theme');
    this.darkTheme = currentTheme === 'dark';
  }

  public toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    const newTheme = this.darkTheme ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    document.cookie = `theme=${newTheme}; path=/;`;
  }
}
