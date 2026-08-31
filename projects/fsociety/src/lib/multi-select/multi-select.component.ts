import {
  Component,
  Input,
  ElementRef,
  HostListener,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FsAnchoredPopoverDirective } from '../overlay/anchored-popover.directive';
import { FsEmptyStateComponent } from '../empty-state/empty-state.component';
import { FsCorners } from '../corners';
import { FsControlSize } from '../control-size';

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
  imports: [CommonModule, FormsModule, FsAnchoredPopoverDirective, FsEmptyStateComponent],
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
export class FsMultiSelectComponent implements ControlValueAccessor {
  readonly Icons = ICONS;

  @Input() options: FsMultiSelectOption[] = [];
  @Input() placeholder = 'Seleccionar...';
  /**
   * URL completa del ícono — se envuelve en `url()` y se pinta con
   * `mask-image`, así que hereda el color del texto.
   * Ej: 'https://api.iconify.design/tabler:user.svg' o 'assets/user.svg'.
   * No es un nombre de Tabler: pasar "user" no renderiza nada ni avisa.
   */
  @Input() iconLeft = '';
  @Input() searchable = true;
  @Input() max = 0;
  @Input() disabled = false;
  @Input() emptyText = 'Sin resultados';

  /**
   * Qué esquinas van redondeadas. Sirve para apoyar el componente contra otra
   * cosa sin que quede una esquina redonda adentro de otra.
   *
   * `start` y `end` son lógicas: en RTL se dan vuelta solas.
   */
  @Input() corners: FsCorners = 'all';

  /**
   * Tamaño del control — 32 / 40 / 48px de alto.
   *
   * Es la escala compartida de la librería: un `fs-button` con el mismo `size`
   * mide exactamente lo mismo, así que campo y botón quedan parejos al
   * ponerlos uno al lado del otro.
   */
  @Input() size: FsControlSize = 'md';

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  value: string[] = [];
  open = false;
  query = '';

  private _onChange: (value: string[]) => void = () => {};
  private _onTouched: () => void = () => {};

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
    if (this.searchable) {
      setTimeout(() => this.searchInputRef?.nativeElement?.focus(), 10);
    }
  }

  close(): void {
    this.open = false;
    this.query = '';
    this._onTouched();
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

  @HostListener('document:mousedown', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (this.open && !this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  /**
   * Escape cierra el panel, igual que en `fs-select` y `fs-date-picker`.
   *
   * Va en `document` y no en el host por el mismo motivo que el click de
   * afuera: el wrapper es un `div` sin `tabindex`, así que al abrir con el
   * mouse el foco se queda en el `body` y un listener del host nunca vería la
   * tecla. Con `searchable` el foco sí entra al buscador — que es descendiente
   * del host — pero no se puede depender de eso, porque `searchable` es
   * opcional.
   */
  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (this.open && event.key === 'Escape') {
      event.preventDefault();
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
