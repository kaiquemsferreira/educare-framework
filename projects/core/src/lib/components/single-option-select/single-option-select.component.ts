import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Component, forwardRef, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'single-option-select',
  templateUrl: './single-option-select.component.html',
  styleUrls: ['./single-option-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleOptionSelectComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule
  ]
})
export class SingleOptionSelectComponent implements ControlValueAccessor {
  @Input() id!: string;
  @Input() label!: string;
  @Input() options!: { label: string, value: any }[];

  public isOpen = false;
  public selectedValue: any;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelectChange(value: any): void {
    this.selectedValue = value;
    this.onChange(value);
    this.onTouched();
  }
}
