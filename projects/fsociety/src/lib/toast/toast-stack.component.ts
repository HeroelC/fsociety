import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  ViewChild,
  signal,
} from '@angular/core';
import { FS_TOAST_EXIT_MS, FsToastItem, FsToastService } from './toast.service';

const CDN = 'https://api.iconify.design';
const ICONS = {
  success: `${CDN}/tabler:circle-check.svg`,
  danger:  `${CDN}/tabler:alert-circle.svg`,
  warning: `${CDN}/tabler:alert-circle.svg`,
  info:    `${CDN}/tabler:info-circle.svg`,
  neutral: `${CDN}/tabler:info-circle.svg`,
  x:       `${CDN}/tabler:x.svg`,
} as const;

/** Minimum travel before a swipe counts as a dismissal, in pixels. */
const SWIPE_MIN_DISTANCE = 64;

/** Alternative threshold: a quarter of the toast's own width. The larger wins. */
const SWIPE_WIDTH_RATIO = 0.25;

/** Spring-back duration when a swipe falls short of the threshold. */
const SWIPE_RETURN_MS = 180;

/** State of the swipe gesture in flight. Never rendered, so it is plain state. */
interface FsToastDrag {
  id: string;
  el: HTMLElement;
  pointerId: number;
  startX: number;
  width: number;
  dx: number;
}

@Component({
  selector: 'fs-toast-stack',
  standalone: true,
  templateUrl: './toast-stack.component.html',
  styleUrl: './toast-stack.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsToastStackComponent implements AfterViewInit {
  readonly Icons = ICONS;

  /**
   * Pauses the auto-dismiss countdown while the pointer is over a toast, or
   * while focus is inside it.
   *
   * Defaults to `true`, unlike the other two inputs: a toast that dismisses
   * itself on a fixed timer and cannot be held open is a WCAG 2.2.1 (Timing
   * Adjustable) barrier for anyone who reads slowly. That makes this
   * accessibility rather than decoration, so it is on unless opted out.
   */
  @Input() pauseOnHover = true;

  /** Opt-in thin bar along the bottom edge showing the remaining time. */
  @Input() fuse = false;

  /** Opt-in horizontal swipe-to-dismiss gesture. New behaviour, so off by default. */
  @Input() swipeToDismiss = false;

  @ViewChild('toaster') toaster!: ElementRef<HTMLElement>;

  /** Ids currently hovered or focus-held. A signal so OnPush re-renders. */
  private readonly hoveredIds = signal<ReadonlySet<string>>(new Set<string>());

  /** Id being swiped, if any. Also a signal, for the same reason. */
  private readonly draggingId = signal<string | null>(null);

  private drag: FsToastDrag | null = null;

  constructor(
    readonly toastService: FsToastService,
    private readonly zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    // The stack is `position: fixed`, which is not enough: an ancestor with a
    // transform, filter or contain becomes its containing block and clips it,
    // so toasts vanished when the app root had any of those. Promoting the
    // stack to the top layer puts it beyond any ancestor's reach.
    //
    // It stays open for the component's whole life — the container is
    // pointer-events: none and only the toasts themselves are interactive, so
    // an always-open popover blocks nothing. No anchoring is needed either;
    // its own right/bottom offsets place it against the viewport.
    const el = this.toaster?.nativeElement;
    if (el && typeof el.showPopover === 'function' && !el.matches(':popover-open')) {
      el.showPopover();
    }
  }

  iconFor(tone: string): string {
    return ICONS[tone as keyof typeof ICONS] ?? ICONS.neutral;
  }

  /** True while the countdown is held, either by hover/focus or by a drag. */
  isPaused(id: string): boolean {
    return this.hoveredIds().has(id) || this.draggingId() === id;
  }

  /** Whether the fuse bar should be rendered for this toast. */
  showFuse(toast: FsToastItem): boolean {
    return this.fuse && (toast.duration ?? 0) > 0;
  }

  /** Animated close, used by the close button and by a completed swipe. */
  dismissToast(id: string): void {
    this.forget(id);
    this.toastService.dismiss(id);
  }

  // ─── Pause on hover / focus ───────────────────────────────────────────────

  onPointerEnter(toast: FsToastItem): void {
    if (!this.pauseOnHover) return;
    this.setHovered(toast.id, true);
  }

  onPointerLeave(toast: FsToastItem): void {
    if (!this.pauseOnHover) return;
    this.setHovered(toast.id, false);
  }

  /**
   * Keyboard users tabbing to the close button get the same reprieve as the
   * mouse. Without this the pause would be a mouse nicety rather than a fix.
   */
  onFocusIn(toast: FsToastItem): void {
    if (!this.pauseOnHover) return;
    this.setHovered(toast.id, true);
  }

  onFocusOut(event: FocusEvent, toast: FsToastItem): void {
    if (!this.pauseOnHover) return;
    // Focus moving between elements inside the same toast is not a departure.
    const host = event.currentTarget as HTMLElement | null;
    const next = event.relatedTarget as Node | null;
    if (host && next && host.contains(next)) return;
    this.setHovered(toast.id, false);
  }

  // ─── Swipe to dismiss ─────────────────────────────────────────────────────

  onPointerDown(event: PointerEvent, toast: FsToastItem): void {
    if (!this.swipeToDismiss || toast.leaving) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    // A drag that starts on the close button must stay a click.
    if ((event.target as HTMLElement | null)?.closest('button')) return;

    const el = event.currentTarget as HTMLElement;
    this.drag = {
      id: toast.id,
      el,
      pointerId: event.pointerId,
      startX: event.clientX,
      width: el.offsetWidth || 1,
      dx: 0,
    };
    el.setPointerCapture?.(event.pointerId);
    el.style.transition = 'none';
    // The entry animation is `forwards`, so its filled transform would pin the
    // element and the drag would go nowhere.
    el.style.animation = 'none';

    // The rest of the gesture is listened to outside Angular: a template
    // `(pointermove)` binding would tick the whole application on every move,
    // which is wasteful on an OnPush component for a value that is purely
    // visual. The handler writes transform/opacity straight onto the element
    // and never touches anything the template reads.
    this.zone.runOutsideAngular(() => {
      el.addEventListener('pointermove', this.onPointerMove);
      el.addEventListener('pointerup', this.onPointerUp);
      el.addEventListener('pointercancel', this.onPointerUp);
    });

    this.draggingId.set(toast.id);
    this.syncTimer(toast.id);
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag.dx = event.clientX - drag.startX;
    drag.el.style.transform = `translateX(${drag.dx}px)`;
    drag.el.style.opacity = `${Math.max(0, 1 - Math.abs(drag.dx) / drag.width)}`;
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    const drag = this.drag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    this.drag = null;
    this.detach(drag.el);
    if (drag.el.hasPointerCapture?.(drag.pointerId)) {
      drag.el.releasePointerCapture(drag.pointerId);
    }

    const threshold = Math.max(SWIPE_MIN_DISTANCE, drag.width * SWIPE_WIDTH_RATIO);
    const dismissed = Math.abs(drag.dx) >= threshold;

    if (dismissed) {
      const direction = drag.dx > 0 ? 1 : -1;
      drag.el.style.transition =
        `transform ${FS_TOAST_EXIT_MS}ms cubic-bezier(.2,.8,.3,1),` +
        ` opacity ${FS_TOAST_EXIT_MS}ms ease`;
      drag.el.style.transform = `translateX(${direction * 110}%)`;
      drag.el.style.opacity = '0';
    } else {
      drag.el.style.transition =
        `transform ${SWIPE_RETURN_MS}ms cubic-bezier(.2,.8,.3,1),` +
        ` opacity ${SWIPE_RETURN_MS}ms ease`;
      drag.el.style.transform = 'translateX(0)';
      drag.el.style.opacity = '1';
      this.releaseInlineStyles(drag.el);
    }

    // Back inside Angular: from here on the signals below feed the template,
    // so the change has to be seen by change detection.
    this.zone.run(() => {
      this.draggingId.set(null);
      if (dismissed) this.dismissToast(drag.id);
      else this.syncTimer(drag.id);
    });
  };

  /**
   * Hands the element back to the stylesheet once a spring-back has landed.
   *
   * The drag writes `transform` and `opacity` inline, and inline styles beat the
   * `.fs-toast--leaving` class rules — so without this a toast that was swiped
   * and released short of the threshold would later exit without moving at all:
   * frozen in place for the exit duration, then gone. Exactly the jump the exit
   * animation exists to remove.
   *
   * `animation` is deliberately left at its inline `none`. Clearing it would
   * restore the class's `fs-toast-in ... forwards` and replay the entrance.
   */
  private releaseInlineStyles(el: HTMLElement): void {
    setTimeout(() => {
      // A new gesture may already own the element; do not stomp on it.
      if (this.drag?.el === el) return;
      el.style.transition = '';
      el.style.transform = '';
      el.style.opacity = '';
    }, SWIPE_RETURN_MS);
  }

  private detach(el: HTMLElement): void {
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('pointercancel', this.onPointerUp);
  }

  // ─── Pause bookkeeping ────────────────────────────────────────────────────

  private setHovered(id: string, hovered: boolean): void {
    const current = this.hoveredIds();
    if (current.has(id) === hovered) return;
    const next = new Set(current);
    if (hovered) next.add(id);
    else next.delete(id);
    this.hoveredIds.set(next);
    this.syncTimer(id);
  }

  /** Single place that decides whether the service timer runs. */
  private syncTimer(id: string): void {
    if (this.isPaused(id)) this.toastService.pause(id);
    else this.toastService.resume(id);
  }

  /** Drops an id from the pause bookkeeping so removed toasts leave nothing behind. */
  private forget(id: string): void {
    const current = this.hoveredIds();
    if (current.has(id)) {
      const next = new Set(current);
      next.delete(id);
      this.hoveredIds.set(next);
    }
    if (this.draggingId() === id) this.draggingId.set(null);
  }
}
