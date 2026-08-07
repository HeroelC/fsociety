import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  upload:      `${CDN}/tabler:upload.svg`,
  file:        `${CDN}/tabler:file.svg`,
  trash:       `${CDN}/tabler:trash.svg`,
  alertCircle: `${CDN}/tabler:alert-circle.svg`,
} as const;

export type FsFileUploadState = 'default' | 'error';

/** A queued file. `file` is the real File, so the form can actually upload it. */
export interface FsUploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

/** Why a dropped file was turned away. */
export interface FsFileRejection {
  file: File;
  reason: 'type' | 'size' | 'count';
  message: string;
}

let fileUploadIdCounter = 0;
let fileIdCounter = 0;

/** Human-readable size. Mirrors the reference's thresholds. */
export function fsFormatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

@Component({
  selector: 'fs-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FsFileUploadComponent),
      multi: true,
    },
  ],
})
export class FsFileUploadComponent implements ControlValueAccessor {
  readonly Icons = ICONS;
  readonly formatSize = fsFormatFileSize;

  @Input() label = '';

  /** Same syntax as the native input: '.pdf,image/*'. Also enforced on drop. */
  @Input() accept = '';

  @Input() multiple = true;
  @Input() disabled = false;
  @Input() state: FsFileUploadState = 'default';
  @Input() errorMessage = '';

  /** Per-file ceiling in bytes. 0 means no limit. */
  @Input() maxSize = 0;

  /** How many files may be queued. 0 means no limit. */
  @Input() maxFiles = 0;

  @Input() hint = 'PNG, JPG o PDF · hasta 10MB';
  @Input() title = 'Arrastrá archivos';
  @Input() subtitle = 'o hacé clic para subir';
  @Input() removeLabel = 'Quitar';

  @Output() valueChange = new EventEmitter<File[]>();

  /** Files turned away by accept, maxSize or maxFiles. */
  @Output() rejected = new EventEmitter<FsFileRejection[]>();

  @ViewChild('input') inputRef?: ElementRef<HTMLInputElement>;

  readonly inputId = `fs-file-upload-${++fileUploadIdCounter}`;

  files: FsUploadFile[] = [];
  dragging = false;

  /** Last batch of rejections, surfaced inline under the dropzone. */
  rejections: FsFileRejection[] = [];

  /**
   * dragenter/dragleave fire for every child element the pointer crosses, so a
   * plain boolean flickers as you move over the icon or the text. Counting
   * enters minus leaves is what keeps the highlight steady.
   */
  private dragDepth = 0;

  private _onChange: (value: File[]) => void = () => {};
  private _onTouched: () => void = () => {};

  // ─── Dropzone ─────────────────────────────────────────────────────────────

  openPicker(): void {
    if (this.disabled) return;
    this.inputRef?.nativeElement.click();
  }

  onDragEnter(event: DragEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    this.dragDepth++;
    this.dragging = true;
  }

  onDragOver(event: DragEvent): void {
    if (this.disabled) return;
    // Without preventDefault the browser navigates to the file instead of
    // letting us handle the drop.
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  onDragLeave(event: DragEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (this.dragDepth === 0) this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    if (this.disabled) return;
    event.preventDefault();
    this.dragDepth = 0;
    this.dragging = false;
    if (event.dataTransfer?.files?.length) this.add(event.dataTransfer.files);
  }

  onPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.add(input.files);
    // Reset so re-picking the same file fires change again.
    input.value = '';
  }

  // ─── Queue ────────────────────────────────────────────────────────────────

  private add(list: FileList): void {
    const incoming = Array.from(list);
    const accepted: FsUploadFile[] = [];
    const rejections: FsFileRejection[] = [];

    for (const file of incoming) {
      if (!this.matchesAccept(file)) {
        rejections.push({
          file,
          reason: 'type',
          message: `${file.name} — tipo de archivo no permitido`,
        });
        continue;
      }
      if (this.maxSize > 0 && file.size > this.maxSize) {
        rejections.push({
          file,
          reason: 'size',
          message: `${file.name} — supera ${fsFormatFileSize(this.maxSize)}`,
        });
        continue;
      }

      const total = (this.multiple ? this.files.length : 0) + accepted.length;
      if (this.maxFiles > 0 && total >= this.maxFiles) {
        rejections.push({
          file,
          reason: 'count',
          message: `${file.name} — máximo ${this.maxFiles} archivo(s)`,
        });
        continue;
      }

      accepted.push({
        id: `fs-file-${++fileIdCounter}`,
        file,
        name: file.name,
        size: file.size,
      });

      if (!this.multiple) break;
    }

    this.files = this.multiple ? [...this.files, ...accepted] : accepted.slice(0, 1);
    this.rejections = rejections;
    if (rejections.length) this.rejected.emit(rejections);
    this.emit();
  }

  remove(id: string): void {
    this.files = this.files.filter(f => f.id !== id);
    this.emit();
  }

  clearAll(): void {
    this.files = [];
    this.rejections = [];
    this.emit();
  }

  /**
   * Mirrors how the native input reads `accept`: a bare extension, an exact MIME
   * type, or a `type/*` wildcard. Drag-and-drop bypasses the attribute entirely,
   * so without this a dropped file of any type would be queued.
   */
  private matchesAccept(file: File): boolean {
    if (!this.accept.trim()) return true;
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return this.accept.split(',').some(raw => {
      const pattern = raw.trim().toLowerCase();
      if (!pattern) return false;
      if (pattern.startsWith('.')) return name.endsWith(pattern);
      if (pattern.endsWith('/*')) return type.startsWith(pattern.slice(0, -1));
      return type === pattern;
    });
  }

  private emit(): void {
    const value = this.files.map(f => f.file);
    this._onChange(value);
    this.valueChange.emit(value);
    this._onTouched();
  }

  // ─── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: File[] | null): void {
    const list = Array.isArray(value) ? value : [];
    this.files = list.map(file => ({
      id: `fs-file-${++fileIdCounter}`,
      file,
      name: file.name,
      size: file.size,
    }));
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
