import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FsTab {
  /** Identificador único de la tab */
  id: string;
  /** Texto visible en el encabezado */
  label: string;
  /** Deshabilita la tab */
  disabled?: boolean;
}

@Component({
  selector: 'fs-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsTabsComponent implements AfterViewInit, OnChanges {

  /** Lista de tabs a renderizar */
  @Input() tabs: FsTab[] = [];

  /** Id de la tab activa */
  @Input() activeTab = '';

  /** Two-way binding: [(activeTab)] */
  @Output() activeTabChange = new EventEmitter<string>();

  /** Emite la tab completa al cambiar */
  @Output() tabChange = new EventEmitter<FsTab>();

  @ViewChild('tabsRow') tabsRow!: ElementRef<HTMLElement>;

  indicatorLeft  = 0;
  indicatorWidth = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    this.updateIndicator();

    // Recalcular al cambiar el tamaño del contenedor
    this.zone.runOutsideAngular(() => {
      const ro = new ResizeObserver(() => {
        this.zone.run(() => {
          this.updateIndicator();
          this.cdr.markForCheck();
        });
      });
      ro.observe(this.tabsRow.nativeElement);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeTab'] || changes['tabs']) {
      // Defer para que el DOM se actualice primero
      setTimeout(() => this.updateIndicator());
    }
  }

  selectTab(tab: FsTab): void {
    if (tab.disabled) return;
    this.activeTab = tab.id;
    this.activeTabChange.emit(tab.id);
    this.tabChange.emit(tab);
    this.updateIndicator();
  }

  isActive(tab: FsTab): boolean {
    return this.activeTab === tab.id;
  }

  private updateIndicator(): void {
    if (!this.tabsRow) return;

    const row   = this.tabsRow.nativeElement;
    const items = row.querySelectorAll<HTMLElement>('.fs-tabs__item');
    const idx   = this.tabs.findIndex(t => t.id === this.activeTab);

    if (idx === -1 || !items[idx]) return;

    const item = items[idx];
    this.indicatorLeft  = item.offsetLeft;
    this.indicatorWidth = item.offsetWidth;
    this.cdr.markForCheck();
  }
}
