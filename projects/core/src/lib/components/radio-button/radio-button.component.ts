import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'radio-button-component',
  imports: [
    NgIf
  ],
  templateUrl: './radio-button.component.html',
  standalone: true,
  styleUrl: './radio-button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RadioButtonComponent {
  @Input() title: string = 'Example';
  @Input() text: string = '$16 / Month / Member';
  @Input() tag: string = 'save 10%';
}
