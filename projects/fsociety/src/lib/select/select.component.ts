import { Component, Input, Output, EventEmitter, HostListener, ElementRef, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  chevronDown: `${CDN}/tabler:chevron-down.svg`,
  search:      `${CDN}/tabler:search.svg`,
  x:           `${CDN}/tabler:x.svg`,
  check:       `${CDN}/tabler:check.svg`,
  alertCircle: `${CDN}/tabler:alert-circle.svg`,
  circleCheck: `${CDN}/tabler:circle-check.svg`,
} as const;

export interface FsSelectOption {
  value: string;
  label: string;
  desc?: string;
  icon?: string;
}

export type FsSelectState = 'default' | 'error' | 'success';

let selectIdCounter = 0;

@Component({
  selector: 'fs-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsSelectComponent),
      multi: true,
    },
  ],
})
export class FsSelectComponent implements ControlValueAccessor, OnDestroy {
  @Input() label = '';
  @Input() placeholder = 'Seleccionar...';
  @Input() hint = '';
  @Input() iconLeft = '';
  @Input() searchable = false;
  @Input() disabled = false;
  @Input() state: FsSelectState = 'default';
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input() emptyText = 'Sin resultados';
  @Input() options: FsSelectOption[] = [];

  @Output() valueChange = new EventEmitter<string>();

  readonly selectId = `fs-select-${++selectIdCounter}`;
  readonly Icons = ICONS;

  value = '';
  open = false;
  query = '';
  highlightIndex = -1;
  menuStyle: Record<string, string> = {};

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private readonly _scrollHandler = () => this.updateMenuPosition();
  private readonly _resizeHandler = () => this.updateMenuPosition();

  constructor(private el: ElementRef) {}

  get selectedOption(): FsSelectOption | undefined {
    return this.options.find(o => o.value === this.value);
  }

  get filteredOptions(): FsSelectOption[] {
    if (!this.query) return this.options;
    const q = this.query.toLowerCase();
    return this.options.filter(
      o => o.label.toLowerCase().includes(q) || (o.desc?.toLowerCase().includes(q) ?? false)
    );
  }

  get stateIconUrl(): string {
    return this.state === 'error' ? ICONS.alertCircle : ICONS.circleCheck;
  }

  toggle(): void {
    if (this.disabled) return;
    this.open ? this.close() : this.openMenu();
  }

  openMenu(): void {
    this.open = true;
    this.query = '';
    const idx = this.options.findIndex(o => o.value === this.value);
    this.highlightIndex = idx >= 0 ? idx : -1;
    this.updateMenuPosition();
    window.addEventListener('scroll', this._scrollHandler, true);
    window.addEventListener('resize', this._resizeHandler);
  }

  close(): void {
    this.open = false;
    this.query = '';
    this.highlightIndex = -1;
    this._onTouched();
    window.removeEventListener('scroll', this._scrollHandler, true);
    window.removeEventListener('resize', this._resizeHandler);
  }

  private updateMenuPosition(): void {
    const wrapper: HTMLElement | null = this.el.nativeElement.querySelector('.fs-select__wrapper');
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();

    // A probe detects if any ancestor has a CSS transform that shifts the
    // position:fixed coordinate system away from the viewport origin.
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;pointer-events:none;visibility:hidden';
    this.el.nativeElement.appendChild(probe);
    const probeRect = probe.getBoundingClientRect();
    this.el.nativeElement.removeChild(probe);

    this.menuStyle = {
      top: `${wrapperRect.bottom + 6 - probeRect.top}px`,
      left: `${wrapperRect.left - probeRect.left}px`,
      width: `${wrapperRect.width}px`,
    };
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this._scrollHandler, true);
    window.removeEventListener('resize', this._resizeHandler);
  }

  select(option: FsSelectOption): void {
    this.value = option.value;
    this._onChange(option.value);
    this.valueChange.emit(option.value);
    this.close();
  }

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      if (this.open) this.close();
    }
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    } else if (this.open) {
      this.handleMenuKey(event);
    }
  }

  onMenuKeydown(event: KeyboardEvent): void {
    this.handleMenuKey(event);
  }

  private handleMenuKey(event: KeyboardEvent): void {
    const opts = this.filteredOptions;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightIndex = Math.min(this.highlightIndex + 1, opts.length - 1);
        this.scrollToHighlighted();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightIndex = Math.max(this.highlightIndex - 1, 0);
        this.scrollToHighlighted();
        break;
      case 'Home':
        event.preventDefault();
        this.highlightIndex = 0;
        this.scrollToHighlighted();
        break;
      case 'End':
        event.preventDefault();
        this.highlightIndex = opts.length - 1;
        this.scrollToHighlighted();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightIndex >= 0 && opts[this.highlightIndex]) {
          this.select(opts[this.highlightIndex]);
        }
        break;
      case 'Escape':
      case 'Tab':
        this.close();
        break;
    }
  }

  private scrollToHighlighted(): void {
    setTimeout(() => {
      const list = this.el.nativeElement.querySelector('.fs-select__list');
      const item = this.el.nativeElement.querySelector('.fs-select__option--highlighted');
      if (!list || !item) return;
      const listTop = list.scrollTop;
      const listBottom = listTop + list.clientHeight;
      const itemTop = (item as HTMLElement).offsetTop;
      const itemBottom = itemTop + (item as HTMLElement).offsetHeight;
      if (itemBottom > listBottom) list.scrollTop = itemBottom - list.clientHeight;
      else if (itemTop < listTop) list.scrollTop = itemTop;
    });
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
