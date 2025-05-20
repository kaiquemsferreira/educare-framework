import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgOptimizedImage, NgStyle } from '@angular/common';

@Component({
  selector: 'lib-image-slider',
  imports: [
    NgClass,
    NgStyle,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss'
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  @Input() sliderImagesColor: string = '#cccccc';
  @Input() mainImageColor: string = '#ffffff';
  @Input() duration: number = 5000;
  @Input() height: string = 'auto';
  @Input() width: string = '100%';
  @Input() images: string[] = [];
  currentIndex: number = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startSlider();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private startSlider() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, this.duration);
  }

  public goTo(index: number) {
    this.currentIndex = index;
  }
}
