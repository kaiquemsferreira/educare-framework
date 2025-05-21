import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SingleOptionSelectComponent } from './single-option-select/single-option-select.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SingleOptionSelectComponent,
    LoadingSpinnerComponent,
    ImageSliderComponent
  ],
  exports: [
    SingleOptionSelectComponent,
    LoadingSpinnerComponent,
    ImageSliderComponent
  ]
})
export class SharedComponentsModule { }
