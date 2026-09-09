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
export type FsPopoverAlign = 'start' | 'center' | 'end';

/** Side the popover prefers. It still flips when that side has no room. */
export type FsPopoverSide = 'bottom' | 'top';

/** Whether the popover may drop its anchor and become a bottom sheet. */
export type FsPopoverSheet = 'never' | 'auto';

/**
 * Viewports where anchoring stops making sense.
 *
 * The width clause covers phones in portrait. The second one covers a phone in
 * landscape, which is wide but only ~360px tall — the case where a flipped
 * popover does the most damage. `pointer: coarse` keeps a merely small desktop
 * window out of it.
 */
export const FS_POPOVER_SHEET_QUERY =
  '(max-width: 640px), (pointer: coarse) and (max-height: 560px)';

/**
 * Keyboard inset the sheet has to clear, published by the directive and read by
 * the `popover-sheet` mixin in `styles/_overlay.scss`.
 *
 * Not prefixed `--_` like a component-private variable: it is the contract
 * between this directive and that mixin, so it has to survive both.
 */
const KEYBOARD_VAR = '--fs-popover-keyboard';

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

  /** Align the popover's left edge to the anchor's, centre it, or align its right edge. */
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

  /**
   * Collapse into a bottom sheet on small, touch-first viewports.
   *
   * Anchoring is a desktop pattern: it assumes the viewport has room on one
   * side of the trigger. On a phone with the keyboard up there is no such room,
   * so the popover flips over the very field being edited. A sheet drops the
   * anchor and takes the bottom edge of the screen as its origin instead.
   *
   * Defaults to `never`, so an existing anchored popover keeps its exact
   * behaviour until it opts in. A tooltip should stay `never` for good: it is
   * passive information, not a decision, and does not deserve the screen.
   */
  @Input() popoverSheet: FsPopoverSheet = 'never';

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
      // The on-screen keyboard resizes only the visual viewport, so `resize`
      // on window never fires for it.
      window.visualViewport?.addEventListener('resize', this.reposition);
      window.visualViewport?.addEventListener('scroll', this.reposition);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['popoverOpen'] || changes['popoverOpen'].isFirstChange()) return;
    this.popoverOpen ? this.show() : this.hide();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition);
    window.visualViewport?.removeEventListener('resize', this.reposition);
    window.visualViewport?.removeEventListener('scroll', this.reposition);
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

  /** Whether this popover should render as a sheet right now. */
  private get asSheet(): boolean {
    return this.popoverSheet === 'auto' && window.matchMedia(FS_POPOVER_SHEET_QUERY).matches;
  }

  /**
   * How much of the bottom of the layout viewport the keyboard is covering.
   *
   * The keyboard shrinks the *visual* viewport and leaves the layout viewport
   * alone, so an element pinned to the bottom stays behind it. That difference
   * is the inset. `env(keyboard-inset-height)` would express this directly but
   * is not shipped widely enough to depend on.
   */
  private keyboardInset(): number {
    const vv = window.visualViewport;
    if (!vv) return 0;
    // Safari can briefly report a visual viewport taller than the layout one
    // while the address bar retracts, which would push the sheet off-screen.
    return Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
  }

  private position(): void {
    const el = this.host.nativeElement;

    if (this.asSheet) {
      this.positionAsSheet(el);
      return;
    }

    this.clearSheet(el);

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
      : this.popoverAlign === 'end'
        ? rect.right - el.offsetWidth
        : rect.left;

    // Keep it inside the viewport when centring pushes it past an edge.
    const maxLeft = window.innerWidth - el.offsetWidth - 4;
    el.style.left = `${Math.max(4, Math.min(left, maxLeft))}px`;
  }

  /**
   * Hands positioning over to the stylesheet.
   *
   * The inline `top` / `left` / `width` written by the anchored path beat any
   * rule in the cascade, so they have to be cleared before the sheet rules can
   * apply — a `@media` block in a component stylesheet could never win against
   * them. From here the directive only decides *that* it is a sheet and how
   * much keyboard to clear; the mixin decides what that looks like.
   */
  private positionAsSheet(el: HTMLElement): void {
    el.style.top = '';
    el.style.left = '';
    el.style.width = '';
    el.style.setProperty(KEYBOARD_VAR, `${this.keyboardInset()}px`);
    el.dataset['fsPopover'] = 'sheet';
  }

  /** Undoes {@link positionAsSheet} when the viewport grows back. */
  private clearSheet(el: HTMLElement): void {
    if (el.dataset['fsPopover'] === undefined) return;
    delete el.dataset['fsPopover'];
    el.style.removeProperty(KEYBOARD_VAR);
  }

  private supportsPopover(el: HTMLElement): boolean {
    return typeof el.showPopover === 'function';
  }
}
