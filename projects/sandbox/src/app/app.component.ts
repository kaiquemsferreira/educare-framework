import { Component, OnInit } from '@angular/core';

import { EducareSvgComponent } from './shared/components/educare-svg/educare-svg.component';
import { version } from '../../../core/src/lib/config/version';
import { NgIf } from '@angular/common';
import { NotificationComponent } from './features/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    EducareSvgComponent,
    NgIf,
    NotificationComponent
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
