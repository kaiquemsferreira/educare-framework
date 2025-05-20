import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    ImageSliderComponent
  ],
  exports: [
    LoadingSpinnerComponent,
    ImageSliderComponent
  ]
})
export class SharedComponentsModule { }
