import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  chevronLeft: `${CDN}/tabler:chevron-left.svg`,
  chevronRight: `${CDN}/tabler:chevron-right.svg`,
} as const;

/**
 * Pointer travel, in CSS px, past which a gesture stops counting as a tap.
 * Only mouse drags ever reach it — see `onPointerCancel`.
 */
const TAP_SLOP_PX = 8;

/** What every slide template receives. */
export interface FsCarouselSlideContext {
  /** Zero-based index of the slide. `let-i` picks it up. */
  $implicit: number;
  /**
   * `true` while the slide sits within `preloadRadius` of the current one.
   * The carousel never decides what a slide holds, so it cannot decide what
   * "loading" means either — it only says when the moment has come.
   */
  shouldLoad: boolean;
}

/**
 * Marks the `<ng-template>` that fs-carousel stamps once per slide. The guard
 * is what makes `let-i` and `let-shouldLoad="shouldLoad"` typed at the call
 * site instead of `any`.
 */
@Directive({
  selector: 'ng-template[fsCarouselSlide]',
  standalone: true,
})
export class FsCarouselSlideDirective {
  static ngTemplateContextGuard(
    _dir: FsCarouselSlideDirective,
    ctx: unknown,
  ): ctx is FsCarouselSlideContext {
    return true;
  }
}

@Component({
  selector: 'fs-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCarouselComponent implements OnChanges {
  readonly Icons = ICONS;

  /** How many slides the template is stamped for. */
  @Input() count = 0;

  /** Accessible name of the whole group. */
  @Input() label = '';

  /**
   * Slide the carousel opens on. Read ONCE, on the first render, against the
   * real width of the track — it positions a carousel that is being created,
   * it does not drive one that already exists. Later changes are ignored on
   * purpose: the scroll position belongs to the user from the first frame on.
   */
  @Input() startAt = 0;

  /** How many slides on each side of the current one report `shouldLoad`. */
  @Input() preloadRadius = 1;

  /**
   * A press that did not turn into a swipe. Useful for opening a lightbox
   * without stealing the gesture that moves the carousel.
   */
  @Output() tapped = new EventEmitter<void>();

  @ContentChild(FsCarouselSlideDirective, { read: TemplateRef })
  slideTemplate?: TemplateRef<FsCarouselSlideContext>;

  @ViewChild('track') trackRef?: ElementRef<HTMLElement>;

  /** Index the track is currently snapped to. */
  current = 0;

  /**
   * One context per slide, mutated in place rather than rebuilt. A fresh
   * object on every change detection pass would hand *ngTemplateOutlet a new
   * identity each time and undo the point of OnPush.
   */
  contexts: FsCarouselSlideContext[] = [];

  private pointerStartX = 0;
  private dragged = false;

  constructor() {
    // The track has no width until it is laid out, and `startAt` is expressed
    // in slides, not pixels. afterNextRender is the first moment where the
    // measurement is real. 'instant' because opening the carousel is not a
    // navigation the user made — animating it would be a lie.
    afterNextRender(() => this.scrollToSlide(this.clamp(this.startAt), 'instant'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['count']) {
      this.current = this.clamp(this.current);
      this.contexts = Array.from({ length: Math.max(0, this.count) }, (_, i) => ({
        $implicit: i,
        shouldLoad: false,
      }));
    }

    if (changes['count'] || changes['preloadRadius']) this.syncPreload();
  }

  get atStart(): boolean {
    return this.current <= 0;
  }

  get atEnd(): boolean {
    return this.current >= this.count - 1;
  }

  /** Label of a single slide, one-based because it is read out loud. */
  slideLabel(index: number): string {
    return `${index + 1} de ${this.count}`;
  }

  goTo(index: number): void {
    this.scrollToSlide(this.clamp(index));
  }

  prev(): void {
    this.goTo(this.current - 1);
  }

  next(): void {
    this.goTo(this.current + 1);
  }

  /**
   * The browser owns the gesture, so the scroll position is the only source of
   * truth about which slide is showing. Nothing is written back to the track
   * here — that would fight the momentum the user just handed to it.
   */
  onScroll(): void {
    const index = this.nearestSlide();
    if (index === this.current) return;

    this.current = index;
    this.syncPreload();
  }

  onPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
    this.dragged = false;
  }

  onPointerMove(event: PointerEvent): void {
    if (Math.abs(event.clientX - this.pointerStartX) > TAP_SLOP_PX) this.dragged = true;
  }

  onPointerUp(): void {
    if (!this.dragged) this.tapped.emit();
    this.dragged = false;
  }

  /**
   * The moment the browser claims the gesture to scroll the track it fires
   * pointercancel, and pointerup never arrives — so on touch the browser is
   * what tells a tap from a swipe, and it is never wrong about it. The
   * TAP_SLOP_PX guard above is the fallback for mouse drags, where no such
   * hand-off happens.
   */
  onPointerCancel(): void {
    this.dragged = false;
  }

  private clamp(index: number): number {
    return Math.min(Math.max(index, 0), Math.max(0, this.count - 1));
  }

  private syncPreload(): void {
    for (const ctx of this.contexts) {
      ctx.shouldLoad = Math.abs(ctx.$implicit - this.current) <= this.preloadRadius;
    }
  }

  /**
   * Positions by the slide's own box instead of `index * width`, so slide
   * widths, gaps and a peeking neighbour all keep working. Leaving `behavior`
   * undefined falls back to the track's CSS `scroll-behavior`, which is where
   * prefers-reduced-motion is honoured.
   */
  private scrollToSlide(index: number, behavior?: ScrollBehavior): void {
    const track = this.trackRef?.nativeElement;
    const slide = track?.children.item(index) as HTMLElement | null;
    if (!track || !slide) return;

    track.scrollTo({ left: slide.offsetLeft, behavior });
  }

  /**
   * `offsetLeft` is measured against the offset parent, and the stylesheet
   * makes the track positioned precisely so that parent is the track itself —
   * which puts both sides of this comparison in the same coordinate space.
   */
  private nearestSlide(): number {
    const track = this.trackRef?.nativeElement;
    if (!track) return this.current;

    let nearest = 0;
    let shortest = Infinity;

    Array.from(track.children).forEach((child, index) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - track.scrollLeft);
      if (distance < shortest) {
        shortest = distance;
        nearest = index;
      }
    });

    return nearest;
  }
}
