import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

import { ScreenSizeModel } from '../../models/screen-size/screen-size.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScreenSizeService {
  private readonly screenSizeSubject = new BehaviorSubject<ScreenSizeModel>({
    isHandsetPortrait: false,
    isHandsetLandscape: false,
    isTabletPortrait: false,
    isTabletLandscape: false,
    isWebPortrait: false,
    isWebLandscape: false
  });
  public screenSize$ = this.screenSizeSubject.asObservable();

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape,
        Breakpoints.TabletPortrait, Breakpoints.TabletLandscape,
        Breakpoints.WebPortrait, Breakpoints.WebLandscape
      ])
      .subscribe((result: BreakpointState) => {
        const model: ScreenSizeModel = {
          isHandsetPortrait: result.breakpoints[Breakpoints.HandsetPortrait],
          isHandsetLandscape: result.breakpoints[Breakpoints.HandsetLandscape],
          isTabletPortrait: result.breakpoints[Breakpoints.TabletPortrait],
          isTabletLandscape: result.breakpoints[Breakpoints.TabletLandscape],
          isWebPortrait: result.breakpoints[Breakpoints.WebPortrait],
          isWebLandscape: result.breakpoints[Breakpoints.WebLandscape]
        };
        this.screenSizeSubject.next(model);
      });
  }
}
