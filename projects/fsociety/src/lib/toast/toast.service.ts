import { Injectable, signal, computed } from '@angular/core';

export type FsToastTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

export interface FsToastItem {
  id: string;
  tone: FsToastTone;
  title?: string;
  text?: string;
  duration?: number;
}

export interface FsToastOptions {
  tone?: FsToastTone;
  title?: string;
  text?: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class FsToastService {
  private readonly _toasts = signal<FsToastItem[]>([]);
  readonly toasts = computed(() => this._toasts());

  push(options: FsToastOptions): string {
    const id = Math.random().toString(36).slice(2);
    const item: FsToastItem = { id, tone: 'neutral', ...options };
    this._toasts.update(list => [...list, item]);
    setTimeout(() => this.remove(id), item.duration ?? 4200);
    return id;
  }

  remove(id: string): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}
