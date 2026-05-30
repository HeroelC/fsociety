import {
  Component,
  Input,
  ElementRef,
  HostListener,
  ViewChild,
  forwardRef,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  chevronDown: `${CDN}/tabler:chevron-down.svg`,
  search:      `${CDN}/tabler:search.svg`,
  x:           `${CDN}/tabler:x.svg`,
  check:       `${CDN}/tabler:check.svg`,
} as const;

export interface FsMultiSelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'fs-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsMultiSelectComponent),
      multi: true,
    },
  ],
})
export class FsMultiSelectComponent implements ControlValueAccessor, OnDestroy {
  readonly Icons = ICONS;

  @Input() options: FsMultiSelectOption[] = [];
  @Input() placeholder = 'Seleccionar...';
  @Input() iconLeft = '';
  @Input() searchable = true;
  @Input() max = 0;
  @Input() disabled = false;
  @Input() emptyText = 'Sin resultados';

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  value: string[] = [];
  open = false;
  query = '';
  menuStyle: Record<string, string> = {};

  private _onChange: (value: string[]) => void = () => {};
  private _onTouched: () => void = () => {};
  private readonly _scrollHandler = () => this.updateMenuPosition();
  private readonly _resizeHandler = () => this.updateMenuPosition();

  constructor(private el: ElementRef) {}

  get filteredOptions(): FsMultiSelectOption[] {
    if (!this.query) return this.options;
    const q = this.query.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  isSelected(val: string): boolean {
    return this.value.includes(val);
  }

  labelOf(val: string): string {
    return this.options.find(o => o.value === val)?.label ?? val;
  }

  toggle(): void {
    if (this.disabled) return;
    this.open ? this.close() : this.openMenu();
  }

  openMenu(): void {
    this.open = true;
    this.query = '';
    this.updateMenuPosition();
    window.addEventListener('scroll', this._scrollHandler, true);
    window.addEventListener('resize', this._resizeHandler);
    if (this.searchable) {
      setTimeout(() => this.searchInputRef?.nativeElement?.focus(), 10);
    }
  }

  close(): void {
    this.open = false;
    this.query = '';
    this._onTouched();
    window.removeEventListener('scroll', this._scrollHandler, true);
    window.removeEventListener('resize', this._resizeHandler);
  }

  toggleOption(val: string): void {
    if (this.isSelected(val)) {
      this.setValue(this.value.filter(v => v !== val));
    } else {
      if (this.max > 0 && this.value.length >= this.max) return;
      this.setValue([...this.value, val]);
    }
  }

  removeChip(val: string, event: MouseEvent): void {
    event.stopPropagation();
    this.setValue(this.value.filter(v => v !== val));
  }

  private setValue(next: string[]): void {
    this.value = next;
    this._onChange(next);
  }

  private updateMenuPosition(): void {
    const wrapper: HTMLElement | null = this.el.nativeElement.querySelector('.fs-ms__wrapper');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();

    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;visibility:hidden';
    this.el.nativeElement.appendChild(probe);
    const probeRect = probe.getBoundingClientRect();
    this.el.nativeElement.removeChild(probe);

    this.menuStyle = {
      top:   `${rect.bottom + 6 - probeRect.top}px`,
      left:  `${rect.left - probeRect.left}px`,
      width: `${rect.width}px`,
    };
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this._scrollHandler, true);
    window.removeEventListener('resize', this._resizeHandler);
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (this.open && !this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  writeValue(value: string[]): void {
    this.value = Array.isArray(value) ? value : [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
