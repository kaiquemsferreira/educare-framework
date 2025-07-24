import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'radio-button',
  imports: [
    NgIf
  ],
  templateUrl: './radio-button.component.html',
  standalone: true,
  styleUrl: './radio-button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RadioButtonComponent {
  @Input() title: string = '';
  @Input() text: string = '';
  @Input() tag: string = '';

  @Input() value: string = '';
  @Input() name: string = 'radio-group';
  @Input() checked: boolean = false;

  @Output() onChange = new EventEmitter<string>();

  get inputId(): string {
    return `radio-${this.value}`;
  }
}
