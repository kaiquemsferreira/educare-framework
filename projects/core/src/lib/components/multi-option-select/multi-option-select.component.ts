import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'multi-option-select',
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './multi-option-select.component.html',
  styleUrl: './multi-option-select.component.scss',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeDropdown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-5px)' }))
      ])
    ])
  ]
})
export class MultiOptionSelectComponent implements AfterViewInit {
  @Input() options: any[] = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'United States', value: 'us2' },
    { label: 'United Kingdom', value: 'uk2' }
  ];
  @Input() addOptionCondition!: (term: string, options: any[]) => boolean;
  @Output() createOption = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Input() placeholder: string = 'Select a option';
  @Input() optionsText: string = 'Options selected';
  @Input() newOptionPlaceholder: string = 'Add new option';
  get showPlaceholder(): boolean {
    return this.searchTerm.length === 0 && this.selectedOptions.length === 0;
  }


  selectedOptions: any[] = [];
  filteredOptions: any[] = [];
  searchTerm = '';
  isOpen = false;
  isCollapsed = false;
  newOptionTerm: string = '';

  @ViewChild('container') containerRef!: ElementRef;

  ngAfterViewInit() {
    this.filteredOptions = [...this.options];
  }

  public toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  public filterOptions() {
    this.filteredOptions = this.options.filter(o =>
      o.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get canShowAddOption(): boolean {
    return true;
  }

  public toggleSelection(option: any) {
    if (this.isSelected(option)) {
      this.selectedOptions = this.selectedOptions.filter(o => o.value !== option.value);
    } else {
      this.selectedOptions.push(option);
    }
    this.selectionChange.emit(this.selectedOptions);
    this.searchTerm = '';
    this.filteredOptions = [...this.options];
  }

  public isSelected(option: any) {
    return this.selectedOptions.some(o => o.value === option.value);
  }

  public removeOption(option: any) {
    this.selectedOptions = this.selectedOptions.filter(o => o.value !== option.value);
    this.selectionChange.emit(this.selectedOptions);
  }

  public addNewOption() {
    const trimmed = this.newOptionTerm.trim();
    if (trimmed === '') return;

    this.createOption.emit(trimmed);
    this.newOptionTerm = '';
    this.isOpen = false;
  }

  public clearAll() {
    this.selectedOptions = [];
    this.selectionChange.emit(this.selectedOptions);
  }

  @HostListener('document:click', ['$event'])
  public handleClickOutside(event: Event) {
    if (this.isOpen && !this.containerRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
