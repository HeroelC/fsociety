import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

const CDN = 'https://api.iconify.design';
const ICONS = {
  chevronDown: `${CDN}/tabler:chevron-down.svg`,
} as const;

export interface FsAccordionItem {
  /** Unique id. Also seeds the header/panel ids that wire up the ARIA pair. */
  id: string;
  /** Header text. */
  title: string;
  /** Plain text, or a TemplateRef when the panel needs real markup. */
  content?: string | TemplateRef<unknown>;
  disabled?: boolean;
}

export interface FsAccordionToggle {
  item: FsAccordionItem;
  open: boolean;
}

let accordionIdCounter = 0;

@Component({
  selector: 'fs-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAccordionComponent implements OnChanges {
  readonly Icons = ICONS;

  @Input() items: FsAccordionItem[] = [];

  /** Allows more than one panel open at a time. */
  @Input() multiple = false;

  /** Ids of the open panels. Two-way: `[(open)]`. */
  @Input()
  set open(ids: string[] | null | undefined) {
    this.openIds = new Set(ids ?? []);
  }
  get open(): string[] {
    return [...this.openIds];
  }

  @Output() openChange = new EventEmitter<string[]>();

  /** Emits the item that changed and its new state. */
  @Output() itemToggle = new EventEmitter<FsAccordionToggle>();

  private openIds = new Set<string>();

  private readonly uid = `fs-accordion-${++accordionIdCounter}`;

  /**
   * Single mode has to hold one panel at most, and `multiple` can arrive after
   * `open` does — input order follows the template, not the declaration.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['multiple'] || changes['open']) && !this.multiple && this.openIds.size > 1) {
      this.openIds = new Set([...this.openIds].slice(0, 1));
    }
  }

  isOpen(item: FsAccordionItem): boolean {
    return this.openIds.has(item.id);
  }

  headId(item: FsAccordionItem): string {
    return `${this.uid}-head-${item.id}`;
  }

  panelId(item: FsAccordionItem): string {
    return `${this.uid}-panel-${item.id}`;
  }

  /** Returns the content only when it is a template, so the view can branch. */
  asTemplate(content: FsAccordionItem['content']): TemplateRef<unknown> | null {
    return content instanceof TemplateRef ? content : null;
  }

  toggle(item: FsAccordionItem): void {
    if (item.disabled) return;

    const wasOpen = this.openIds.has(item.id);
    if (!this.multiple) this.openIds.clear();
    if (wasOpen) this.openIds.delete(item.id);
    else this.openIds.add(item.id);

    this.openChange.emit([...this.openIds]);
    this.itemToggle.emit({ item, open: !wasOpen });
  }
}
