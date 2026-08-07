import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

/**
 * Shared mechanics for fs-modal and fs-drawer.
 *
 * Both are a native <dialog> opened with showModal(), which is what the two
 * components are really about. Doing it natively hands over four things a
 * hand-rolled overlay has to build and usually gets wrong:
 *
 *   - a focus trap, so Tab cannot walk out into the page behind
 *   - focus restored to whatever was focused before opening
 *   - the rest of the document made inert, which aria-modal only *claims*
 *   - the top layer, so no z-index can put a dropdown above the modal
 *
 * Escape is handled by the browser too: it fires `cancel`, then `close`.
 *
 * Three things it does NOT do, and this base does:
 *   - close on a backdrop click
 *   - lock the page behind from scrolling
 *   - keep the open state in sync when the browser closes the dialog itself
 *
 * Declared @Directive() so Angular picks up the inputs and outputs for the
 * subclasses; it is abstract and never used on its own.
 */
@Directive()
export abstract class FsDialogBase implements OnChanges, OnDestroy {
  /** Two-way: `[(open)]`. */
  @Input() open = false;

  @Input() heading = '';

  /** Clicking the dimmed area closes it. */
  @Input() closeOnBackdrop = true;

  /** Escape closes it. When false, the browser's cancel is suppressed. */
  @Input() closeOnEscape = true;

  /** Shows the X in the header. */
  @Input() showClose = true;

  @Input() closeLabel = 'Cerrar';

  /**
   * Prevents the page behind from scrolling while open. Native <dialog> does not
   * do this — the body keeps scrolling under the backdrop.
   */
  @Input() lockScroll = true;

  @Output() openChange = new EventEmitter<boolean>();

  /** Emits after it has closed, whatever closed it. */
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialog') dialogRef?: ElementRef<HTMLDialogElement>;

  private scrollLocked = false;
  private previousBodyOverflow = '';
  private previousBodyPaddingRight = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['open']) return;
    // The view may not exist on the very first change; the template calls
    // syncOpenState from its own lifecycle in that case.
    this.syncOpenState();
  }

  ngOnDestroy(): void {
    this.releaseScroll();
  }

  /** Opens or closes the native dialog to match the `open` input. */
  protected syncOpenState(): void {
    const el = this.dialogRef?.nativeElement;
    if (!el) return;

    if (this.open && !el.open) {
      el.showModal();
      this.lockScrollIfNeeded();
    } else if (!this.open && el.open) {
      el.close();
    }
  }

  /**
   * The browser can close the dialog without us — Escape, or a form with
   * method="dialog". This is what keeps `open` from going stale in that case.
   */
  onNativeClose(): void {
    this.releaseScroll();
    if (this.open) {
      this.open = false;
      this.openChange.emit(false);
    }
    this.closed.emit();
  }

  onNativeCancel(event: Event): void {
    if (!this.closeOnEscape) {
      // Suppressing cancel is the only way to opt out of Escape on a native
      // modal dialog.
      event.preventDefault();
    }
  }

  /**
   * A click on the backdrop lands on the <dialog> element itself, because the
   * dialog box is the padding-free container and all visible content sits in an
   * inner wrapper. A click on the content targets that wrapper or deeper.
   */
  onDialogClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop) return;
    if (event.target === this.dialogRef?.nativeElement) this.requestClose();
  }

  requestClose(): void {
    this.dialogRef?.nativeElement.close();
  }

  // ─── Scroll lock ──────────────────────────────────────────────────────────

  private lockScrollIfNeeded(): void {
    if (!this.lockScroll || this.scrollLocked) return;
    const body = document.body;

    // Hiding the scrollbar reflows the page by its width, which reads as the
    // content jumping sideways as the modal opens. Padding compensates for it.
    const gutter = window.innerWidth - document.documentElement.clientWidth;

    this.previousBodyOverflow = body.style.overflow;
    this.previousBodyPaddingRight = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (gutter > 0) {
      const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + gutter}px`;
    }
    this.scrollLocked = true;
  }

  private releaseScroll(): void {
    if (!this.scrollLocked) return;
    document.body.style.overflow = this.previousBodyOverflow;
    document.body.style.paddingRight = this.previousBodyPaddingRight;
    this.scrollLocked = false;
  }
}
