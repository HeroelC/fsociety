import { Injectable, signal, computed } from '@angular/core';

export type FsToastTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral';

/**
 * Default lifespan of a toast, in milliseconds. `push()` normalises it onto the
 * item so consumers (and the template) can always read `toast.duration`.
 */
export const FS_TOAST_DEFAULT_DURATION = 4200;

/**
 * Exit animation length, in milliseconds.
 *
 * Kept in sync by hand with the `$fs-toast-exit` duration in
 * `toast-stack.component.scss`: the JS timeout below removes the item and the
 * CSS transition slides it out, so if one changes the other must change too.
 */
export const FS_TOAST_EXIT_MS = 240;

export interface FsToastItem {
  id: string;
  tone: FsToastTone;
  title?: string;
  text?: string;
  /**
   * Lifespan in milliseconds. Always present on items produced by `push()`.
   * `0` (or any negative value) means the toast never auto-dismisses.
   */
  duration?: number;
  /**
   * Read-only internal state: set by the stack while the toast plays its exit
   * animation, just before it is removed. Do not set it when pushing.
   */
  leaving?: boolean;
}

export interface FsToastOptions {
  tone?: FsToastTone;
  title?: string;
  text?: string;
  /** Milliseconds before auto-dismiss. `0` or negative keeps the toast sticky. */
  duration?: number;
}

/** Bookkeeping for one pausable auto-dismiss timer. */
interface FsToastTimer {
  /** `null` while the timer is paused — that is what makes pause/resume idempotent. */
  handle: ReturnType<typeof setTimeout> | null;
  /** Milliseconds still owed when the timer was last (re)started. */
  remaining: number;
  /** `Date.now()` of the last start, used to work out the elapsed slice. */
  startedAt: number;
}

@Injectable({ providedIn: 'root' })
export class FsToastService {
  private readonly _toasts = signal<FsToastItem[]>([]);
  readonly toasts = computed(() => this._toasts());

  private readonly timers = new Map<string, FsToastTimer>();

  push(options: FsToastOptions): string {
    const id = Math.random().toString(36).slice(2);
    const item: FsToastItem = {
      id,
      tone: 'neutral',
      ...options,
      duration: options.duration ?? FS_TOAST_DEFAULT_DURATION,
    };
    this._toasts.update(list => [...list, item]);
    this.schedule(id, item.duration!);
    return id;
  }

  /** Immediate, non-animated removal. Part of the public API since v0.x. */
  remove(id: string): void {
    this.clearTimer(id);
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  /**
   * Animated removal: stops the timer, flags the item so the stack can play the
   * exit transition and collapse the gap, then removes it for real.
   */
  dismiss(id: string): void {
    this.clearTimer(id);
    let found = false;
    this._toasts.update(list =>
      list.map(t => {
        if (t.id !== id || t.leaving) return t;
        found = true;
        return { ...t, leaving: true };
      }),
    );
    if (!found) return;
    setTimeout(() => this.remove(id), FS_TOAST_EXIT_MS);
  }

  /**
   * Freezes the auto-dismiss countdown. No-op for unknown ids, sticky toasts
   * and timers that are already paused.
   */
  pause(id: string): void {
    const timer = this.timers.get(id);
    if (!timer || timer.handle === null) return;
    clearTimeout(timer.handle);
    timer.handle = null;
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
  }

  /**
   * Restarts a paused countdown with whatever time was left. No-op for unknown
   * ids, sticky toasts and timers that are already running.
   */
  resume(id: string): void {
    const timer = this.timers.get(id);
    if (!timer || timer.handle !== null) return;
    timer.startedAt = Date.now();
    timer.handle = setTimeout(() => this.dismiss(id), timer.remaining);
  }

  private schedule(id: string, duration: number): void {
    // A non-positive duration means "sticky": no timer at all, which also makes
    // pause()/resume() safe no-ops for that toast.
    if (duration <= 0) return;
    this.timers.set(id, {
      handle: setTimeout(() => this.dismiss(id), duration),
      remaining: duration,
      startedAt: Date.now(),
    });
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (!timer) return;
    if (timer.handle !== null) clearTimeout(timer.handle);
    this.timers.delete(id);
  }
}
