import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
} from '@angular/core';

/** Horizontal alignment of the popover against its anchor. */
export type FsPopoverAlign = 'start' | 'center';

/** Side the popover prefers. It still flips when that side has no room. */
export type FsPopoverSide = 'bottom' | 'top';

/**
 * Renders the host element in the browser's top layer, anchored to a trigger.
 *
 * `position: fixed` is not enough to escape a container. Any ancestor with a
 * `transform`, `filter`, `backdrop-filter`, `contain` or `will-change` becomes
 * the containing block for fixed descendants, so the dropdown is positioned
 * *and clipped* relative to that ancestor instead of the viewport. That is why
 * a menu inside a card, a scroll area or a Storybook docs block gets cut off.
 *
 * The Popover API sidesteps the whole problem: a `popover` element is painted
 * in the top layer, above every stacking context, and no ancestor `overflow`
 * or `transform` can clip it. Coordinates then resolve against the viewport,
 * so a plain `getBoundingClientRect()` is all the positioning needs.
 *
 * Where `showPopover` is unavailable the host keeps its stylesheet position and
 * degrades to the previous in-flow behaviour rather than disappearing.
 *
 * @example
 * ```html
 * <div class="field" #anchor>…</div>
 * @if (open) {
 *   <div class="menu" [fsAnchoredPopover]="anchor">…</div>
 * }
 * ```
 */
@Directive({
  selector: '[fsAnchoredPopover]',
  standalone: true,
  host: { popover: 'manual' },
})
export class FsAnchoredPopoverDirective implements AfterViewInit, OnChanges, OnDestroy {
  /** Element the popover is aligned against. */
  @Input({ alias: 'fsAnchoredPopover', required: true }) anchor!: HTMLElement;

  /** Vertical gap between the anchor and the popover, in px. */
  @Input() popoverOffset = 6;

  /** Match the anchor's width. Disable for popovers that size themselves. */
  @Input() popoverMatchWidth = true;

  /** Align the popover's left edge to the anchor's, or centre it. */
  @Input() popoverAlign: FsPopoverAlign = 'start';

  /** Side to prefer. Either way it flips when that side has no room. */
  @Input() popoverSide: FsPopoverSide = 'bottom';

  /**
   * Drives visibility explicitly. Leave unset for content already gated behind
   * an `@if`, which shows on init and hides on destroy. Set it when the element
   * stays in the DOM and only its visibility toggles, so CSS can transition
   * `:popover-open` in both directions.
   */
  @Input() popoverOpen?: boolean;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  private readonly reposition = () => this.position();

  ngAfterViewInit(): void {
    if (this.popoverOpen === undefined) {
      this.show();
    } else if (this.popoverOpen) {
      this.show();
    }

    // Scroll is captured so that scrolling any ancestor keeps the popover
    // pinned. Outside Angular: positioning writes to style directly, no CD.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.reposition, true);
      window.addEventListener('resize', this.reposition);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['popoverOpen'] || changes['popoverOpen'].isFirstChange()) return;
    this.popoverOpen ? this.show() : this.hide();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition);
    this.hide();
  }

  private show(): void {
    const el = this.host.nativeElement;
    if (this.supportsPopover(el) && !el.matches(':popover-open')) {
      el.showPopover();
    }
    this.position();
  }

  private hide(): void {
    const el = this.host.nativeElement;
    if (this.supportsPopover(el) && el.isConnected && el.matches(':popover-open')) {
      el.hidePopover();
    }
  }

  private position(): void {
    const el = this.host.nativeElement;
    const rect = this.anchor?.getBoundingClientRect();
    if (!rect) return;

    if (this.popoverMatchWidth) {
      el.style.width = `${rect.width}px`;
    }

    const height = el.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom - this.popoverOffset;
    const spaceAbove = rect.top - this.popoverOffset;

    // Honour the preferred side, but flip when it has no room and the other
    // side has more.
    const wantsTop = this.popoverSide === 'top';
    const fitsPreferred = (wantsTop ? spaceAbove : spaceBelow) >= height;
    const onTop = fitsPreferred
      ? wantsTop
      : (wantsTop ? spaceBelow <= spaceAbove : spaceAbove > spaceBelow);

    el.style.top = onTop
      ? `${rect.top - this.popoverOffset - height}px`
      : `${rect.bottom + this.popoverOffset}px`;

    const left = this.popoverAlign === 'center'
      ? rect.left + rect.width / 2 - el.offsetWidth / 2
      : rect.left;

    // Keep it inside the viewport when centring pushes it past an edge.
    const maxLeft = window.innerWidth - el.offsetWidth - 4;
    el.style.left = `${Math.max(4, Math.min(left, maxLeft))}px`;
  }

  private supportsPopover(el: HTMLElement): boolean {
    return typeof el.showPopover === 'function';
  }
}
