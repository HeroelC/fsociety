import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

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
export class FsAnchoredPopoverDirective implements AfterViewInit, OnDestroy {
  /** Element the popover is aligned against. */
  @Input({ alias: 'fsAnchoredPopover', required: true }) anchor!: HTMLElement;

  /** Vertical gap between the anchor and the popover, in px. */
  @Input() popoverOffset = 6;

  /** Match the anchor's width. Disable for popovers that size themselves. */
  @Input() popoverMatchWidth = true;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);

  private readonly reposition = () => this.position();

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;

    if (this.supportsPopover(el)) {
      el.showPopover();
    }

    this.position();

    // Scroll is captured so that scrolling any ancestor keeps the menu pinned.
    // Outside Angular: positioning writes to style directly, no CD needed.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.reposition, true);
      window.addEventListener('resize', this.reposition);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition);

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

    // Flip above the anchor when the menu would run past the viewport bottom
    // and there is genuinely more space above.
    const height = el.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom - this.popoverOffset;
    const spaceAbove = rect.top - this.popoverOffset;
    const flip = height > spaceBelow && spaceAbove > spaceBelow;

    el.style.left = `${rect.left}px`;
    el.style.top = flip
      ? `${rect.top - this.popoverOffset - height}px`
      : `${rect.bottom + this.popoverOffset}px`;
  }

  private supportsPopover(el: HTMLElement): boolean {
    return typeof el.showPopover === 'function';
  }
}
