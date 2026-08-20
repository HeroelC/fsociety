import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FsTableComponent, FsTableSort } from './table.component';
import { FsColumnDirective } from './table-column.directive';
import { FsColumnFilterDirective } from './table-column-filter.directive';
import { FsBadgeComponent } from '../badge/badge.component';
import { FsButtonComponent } from '../button/button.component';
import { FsInputComponent } from '../input/input.component';
import { FsSelectComponent, FsSelectOption } from '../select/select.component';
import { FsCheckboxComponent } from '../choice/checkbox.component';
import { FsSegmentedComponent, FsSegmentOption } from '../choice/segmented.component';
import { FsNumberInputComponent } from '../number-input/number-input.component';
import { FsDrawerComponent } from '../dialog/drawer.component';

// ─────────────────────────────────────────────────────────────────────────────
// Composición: backoffice de una inmobiliaria.
//
// La tabla no sabe nada de propiedades. Aporta estructura, orden, selección,
// estados, el modo tarjeta y el MECANISMO de filtro — el embudo, el panel
// anclado, que haya uno solo abierto. Qué hay adentro del panel y qué se filtra
// con eso vive acá.
//
// Es la línea a propósito: si `fs-table` supiera qué es una "propiedad pausada"
// o que los alquileres se cotizan en pesos, dejaría de servir para cualquier
// otra pantalla.
//
// Un solo estado manda. El chip de estado, el embudo de la columna Estado y la
// hoja de filtros de mobile escriben el MISMO array. Lo mismo el orden: el
// select y el click en el encabezado. Por eso nunca se contradicen.
// ─────────────────────────────────────────────────────────────────────────────

type Operation = 'venta' | 'alquiler';
type PropertyStatus = 'activa' | 'borrador' | 'pausada' | 'reservada' | 'vendida';
type Currency = 'USD' | 'ARS';

interface Property {
  code: string;
  title: string;
  photo: string;
  operation: Operation;
  price: number;
  currency: Currency;
  status: PropertyStatus;
  leads: number;
  updated: string;
  alert: string;
}

const PROPERTIES: Property[] = [
  { code: 'NP-0412', title: 'Casa 4 amb. con jardín — Villa Adelina', photo: 'linear-gradient(135deg,#8b5cf6,#6366f1)', operation: 'venta',    price: 289000,  currency: 'USD', status: 'activa',    leads: 12, updated: '2026-08-18', alert: '' },
  { code: 'NP-0408', title: 'Depto 2 amb. a estrenar — Palermo',      photo: 'linear-gradient(135deg,#0ea5e9,#22d3ee)', operation: 'alquiler', price: 780000,  currency: 'ARS', status: 'activa',    leads: 31, updated: '2026-08-17', alert: '' },
  { code: 'NP-0401', title: 'PH 3 amb. con terraza — Caballito',      photo: 'linear-gradient(135deg,#f59e0b,#f97316)', operation: 'venta',    price: 165000,  currency: 'USD', status: 'pausada',   leads: 0,  updated: '2026-08-11', alert: 'Sin fotos desde hace 3 semanas' },
  { code: 'NP-0397', title: 'Local comercial 60 m² — Belgrano',       photo: 'linear-gradient(135deg,#10b981,#34d399)', operation: 'alquiler', price: 1250000, currency: 'ARS', status: 'reservada', leads: 8,  updated: '2026-08-09', alert: '' },
  { code: 'NP-0390', title: 'Loft 1 amb. reciclado — San Telmo',      photo: 'linear-gradient(135deg,#ec4899,#f43f5e)', operation: 'venta',    price: 98500,   currency: 'USD', status: 'borrador',  leads: 0,  updated: '2026-08-04', alert: 'Falta el precio publicado' },
  { code: 'NP-0384', title: 'Casa quinta con pileta — Pilar',         photo: 'linear-gradient(135deg,#14b8a6,#06b6d4)', operation: 'venta',    price: 415000,  currency: 'USD', status: 'activa',    leads: 19, updated: '2026-07-30', alert: '' },
  { code: 'NP-0379', title: 'Depto 3 amb. con cochera — Núñez',       photo: 'linear-gradient(135deg,#6366f1,#a855f7)', operation: 'alquiler', price: 940000,  currency: 'ARS', status: 'activa',    leads: 24, updated: '2026-07-26', alert: '' },
  { code: 'NP-0371', title: 'Oficina 120 m² — Microcentro',           photo: 'linear-gradient(135deg,#64748b,#94a3b8)', operation: 'alquiler', price: 2100000, currency: 'ARS', status: 'pausada',   leads: 2,  updated: '2026-07-19', alert: 'Vencida la exclusividad' },
  { code: 'NP-0366', title: 'Terreno 300 m² — Escobar',               photo: 'linear-gradient(135deg,#84cc16,#22c55e)', operation: 'venta',    price: 62000,   currency: 'USD', status: 'activa',    leads: 5,  updated: '2026-07-15', alert: '' },
  { code: 'NP-0359', title: 'Duplex 4 amb. — Tigre',                  photo: 'linear-gradient(135deg,#f97316,#ef4444)', operation: 'venta',    price: 198000,  currency: 'USD', status: 'vendida',   leads: 41, updated: '2026-07-02', alert: '' },
];

const STATUS_LABEL: Record<PropertyStatus, string> = {
  activa: 'Activa', borrador: 'Borrador', pausada: 'Pausada', reservada: 'Reservada', vendida: 'Vendida',
};

const STATUS_COLOR: Record<PropertyStatus, string> = {
  activa: 'success', borrador: 'neutral', pausada: 'warning', reservada: 'secondary', vendida: 'neutral',
};

const OPERATION_LABEL: Record<Operation, string> = { venta: 'Venta', alquiler: 'Alquiler' };

/**
 * Rangos rápidos por moneda. Un atajo en dólares no sirve para pesos: 200.000
 * es una casa en una moneda y un alquiler mensual en la otra.
 */
const PRICE_PRESETS: Record<Currency, { label: string; min: number | null; max: number | null }[]> = {
  USD: [
    { label: 'Hasta US$ 100.000',     min: null,    max: 100000  },
    { label: 'US$ 100.000 – 250.000', min: 100000,  max: 250000  },
    { label: 'Más de US$ 250.000',    min: 250000,  max: null    },
  ],
  ARS: [
    { label: 'Hasta $ 800.000',       min: null,    max: 800000  },
    { label: '$ 800.000 – 1.500.000', min: 800000,  max: 1500000 },
    { label: 'Más de $ 1.500.000',    min: 1500000, max: null    },
  ],
};

const PAGE_SIZE = 6;

@Component({
  selector: 'fs-properties-demo',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    FsTableComponent, FsColumnDirective, FsColumnFilterDirective,
    FsBadgeComponent, FsButtonComponent, FsInputComponent, FsSelectComponent,
    FsCheckboxComponent, FsSegmentedComponent, FsNumberInputComponent, FsDrawerComponent,
  ],
  styles: [`
    .demo {
      display: flex; flex-direction: column; gap: 16px;
      font-family: var(--fs-font-sans);
      container-type: inline-size;
      container-name: demo;
    }

    .demo__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .demo__title { margin: 0; font-size: 20px; font-weight: 600; }
    .demo__search { min-width: 240px; flex: 1 1 240px; max-width: 380px; }

    .demo__bulk {
      display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
      padding: 8px 8px 8px 14px; border-radius: 10px;
      background: color-mix(in srgb, var(--fs-color-primary) 10%, transparent);
      border: 1px solid color-mix(in srgb, var(--fs-color-primary) 26%, transparent);
    }
    .demo__bulk-count { font-size: 13.5px; font-weight: 600; margin-inline-end: 4px; }
    .demo__bulk-spacer { flex: 1; }

    .demo__filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .demo__chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .demo__spacer { flex: 1; }
    .demo__sort { min-width: 180px; }

    .demo__chip {
      appearance: none; cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px;
      min-height: 32px; padding: 0 12px;
      border: 1px solid var(--fs-color-border);
      border-radius: 999px;
      background: var(--fs-color-surface);
      font: 500 13px var(--fs-font-sans);
      color: var(--fs-color-text-secondary);
    }
    .demo__chip:hover { border-color: var(--fs-color-border-strong); }
    .demo__chip:focus-visible { outline: 2px solid var(--fs-color-primary); outline-offset: 2px; }
    .demo__chip[aria-pressed='true'] {
      border-color: var(--fs-color-primary);
      color: var(--fs-color-primary);
      background: color-mix(in srgb, var(--fs-color-primary) 8%, transparent);
    }
    .demo__chip-count { opacity: .65; font-variant-numeric: tabular-nums; }

    /* Los embudos viven en el encabezado, y en modo tarjeta el encabezado se
       esconde. Sin este botón, en mobile los filtros quedan inalcanzables. */
    .demo__sheet-btn { display: none; }
    @container demo (max-width: 720px) {
      .demo__sheet-btn { display: inline-flex; }
      .demo__chips { order: 2; width: 100%; }
    }

    .demo__panel { display: flex; flex-direction: column; gap: 8px; }
    .demo__panel-foot { display: flex; justify-content: flex-end; padding-top: 4px; }
    .demo__panel-row { display: flex; flex-direction: column; gap: 8px; }
    .demo__preset {
      appearance: none; cursor: pointer; text-align: start;
      padding: 6px 8px; border: none; border-radius: var(--fs-radius-sm);
      background: none; font: 13px var(--fs-font-sans); color: var(--fs-color-text-secondary);
    }
    .demo__preset:hover { background: color-mix(in srgb, var(--fs-color-text-primary) 6%, transparent); color: var(--fs-color-text-primary); }
    .demo__preset:focus-visible { outline: 2px solid var(--fs-color-primary); outline-offset: 1px; }

    .demo__sheet { display: flex; flex-direction: column; gap: 20px; padding-bottom: 8px; }
    .demo__sheet-group { display: flex; flex-direction: column; gap: 8px; }
    .demo__sheet-title { font: 600 12px var(--fs-font-sans); text-transform: uppercase; letter-spacing: .04em; color: var(--fs-color-text-secondary); }
    .demo__sheet-foot { display: flex; align-items: center; gap: 8px; padding-top: 12px; }

    .demo__foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .demo__count { font-size: 13px; color: var(--fs-color-text-secondary); }
    .demo__pager { display: flex; align-items: center; gap: 8px; }

    .demo__cell-title { display: block; }
    .demo__link { color: inherit; text-decoration: none; font-weight: 500; }
    .demo__link:hover { text-decoration: underline; }
    .demo__link:focus-visible { outline: 2px solid var(--fs-color-primary); outline-offset: 2px; border-radius: 3px; }
    .demo__code { font-family: var(--fs-font-mono); font-size: 12px; color: var(--fs-color-text-secondary); }
    .demo__alert { display: inline; margin-inline-start: 5px; color: var(--fs-warning-base); font-size: 14px; cursor: help; }
    .demo__leads { font-variant-numeric: tabular-nums; }
    .demo__leads--zero { color: var(--fs-color-text-placeholder); }
    .demo__actions { display: inline-flex; gap: 2px; }

    .demo__empty { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .demo__empty strong { font-size: 15px; }
    .demo__empty span { font-size: 13px; color: var(--fs-color-text-secondary); max-width: 320px; text-align: center; }

    .demo__log { font-size: 12.5px; color: var(--fs-color-text-secondary); min-height: 18px; }
  `],
  template: `
    <div class="demo">

      <div class="demo__head">
        <h2 class="demo__title">Propiedades</h2>
        <div class="demo__search">
          <fs-input placeholder="Buscar por título o código..." [clearable]="true"
                    [ngModel]="query" (ngModelChange)="onQuery($event)" />
        </div>
        <fs-button size="sm">Cargar propiedad</fs-button>
      </div>

      <fs-table
        [rows]="pageRows"
        rowKey="code"
        caption="Propiedades publicadas"
        [selectable]="true"
        [selected]="selected"
        (selectedChange)="selected = $event"
        [selectLabel]="selectLabel"
        [sort]="sort"
        (sortChange)="onSort($event)"
        [density]="density"
        [loading]="loading"
        [skeletonRows]="4"
        (rowActivate)="log = 'Fila abierta: ' + $any($event).code"
      >

        <!-- ── Toolbar ───────────────────────────────────────────────────── -->
        <div fsTableToolbar style="display:flex;flex-direction:column;gap:10px;">

          @if (selected.length) {
            <div class="demo__bulk" role="group" aria-label="Acciones sobre la selección">
              <span class="demo__bulk-count">
                {{ selected.length }} {{ selected.length === 1 ? 'propiedad seleccionada' : 'propiedades seleccionadas' }}
              </span>
              <fs-button size="sm" variant="secondary" (click)="bulk('Pausar')">Pausar</fs-button>
              <fs-button size="sm" variant="secondary" (click)="bulk('Destacar')">Destacar</fs-button>
              <fs-button size="sm" variant="secondary" (click)="bulk('Exportar')">Exportar</fs-button>
              <fs-button size="sm" variant="danger" (click)="bulk('Eliminar')">Eliminar</fs-button>
              <span class="demo__bulk-spacer"></span>
              <fs-button size="sm" variant="ghost" ariaLabel="Deseleccionar todo" (click)="selected = []">✕</fs-button>
            </div>
          }

          <div class="demo__filters">
            <div class="demo__chips" role="group" aria-label="Filtrar por estado">
              @for (chip of statusChips; track chip.value) {
                <button type="button" class="demo__chip"
                        [attr.aria-pressed]="chipPressed(chip.value)"
                        (click)="onChip(chip.value)">
                  {{ chip.label }}
                  <span class="demo__chip-count">{{ chip.count }}</span>
                </button>
              }
            </div>

            <span class="demo__spacer"></span>

            <fs-button class="demo__sheet-btn" size="sm" variant="secondary" (click)="sheetOpen = true">
              Filtros{{ activeFilterCount ? ' · ' + activeFilterCount : '' }}
            </fs-button>

            @if (hasAnyFilter) {
              <fs-button size="sm" variant="ghost" (click)="clearFilters()">Limpiar filtros</fs-button>
            }

            <div class="demo__sort">
              <fs-select placeholder="Ordenar por" [options]="sortOptions"
                         [ngModel]="sortValue" (ngModelChange)="onSortSelect($event)" />
            </div>
          </div>
        </div>

        <!-- ── Columnas ──────────────────────────────────────────────────── -->

        <ng-template fsColumn="photo" header="Foto" [headerHidden]="true" cardSlot="media" let-row>
          <div class="fs-table__media" [style.background]="row.photo" role="img"
               [attr.aria-label]="'Foto de ' + row.title"></div>
        </ng-template>

        <ng-template fsColumn="title" header="Propiedad" cardSlot="title" [sortable]="true" let-row>
          <span class="demo__cell-title">
            <a class="demo__link" href="#" (click)="openRow(row, $event)">{{ row.title }}</a>
            @if (row.alert) {
              <span class="demo__alert" [title]="row.alert" role="img" [attr.aria-label]="row.alert">⚠</span>
            }
          </span>
        </ng-template>

        <ng-template fsColumn="code" header="Código" cardSlot="meta" let-row>
          <span class="demo__code">{{ row.code }}</span>
        </ng-template>

        <ng-template fsColumn="operation" header="Operación" cardSlot="meta"
                     [filterCount]="opFilter.length" let-row>
          {{ operationLabel[row.operation] }}
        </ng-template>

        <ng-template fsColumn="price" header="Precio" align="end" cardSlot="value"
                     [sortable]="true" [filterCount]="priceActive ? 1 : 0" let-row>
          {{ money(row) }}
        </ng-template>

        <ng-template fsColumn="status" header="Estado" cardSlot="status"
                     [filterCount]="statusFilter.length" let-row>
          <fs-badge size="sm" [color]="statusColor[row.status]">{{ statusLabel[row.status] }}</fs-badge>
        </ng-template>

        <ng-template fsColumn="leads" header="Consultas" align="end" cardSlot="meta" [sortable]="true" let-row>
          <span class="demo__leads" [class.demo__leads--zero]="!row.leads">{{ row.leads }}</span>
        </ng-template>

        <ng-template fsColumn="updated" header="Actualizada" cardSlot="meta" [sortable]="true" let-row>
          {{ day(row.updated) }}
        </ng-template>

        <ng-template fsColumn="actions" header="Acciones" [headerHidden]="true" align="end" cardSlot="actions" let-row>
          <span class="demo__actions">
            <fs-button size="sm" variant="ghost" [ariaLabel]="'Editar ' + row.title" (click)="act('Editar', row)">✎</fs-button>
            <fs-button size="sm" variant="ghost" [ariaLabel]="'Ver ' + row.title + ' en el sitio'" (click)="act('Ver', row)">↗</fs-button>
          </span>
        </ng-template>

        <!-- ── Paneles de filtro ─────────────────────────────────────────── -->
        <!-- El contenido está en templates aparte para que el embudo del
             encabezado y la hoja de mobile muestren exactamente lo mismo. -->

        <ng-template fsColumnFilter="operation" panelWidth="200px" let-close>
          <ng-container *ngTemplateOutlet="opPanel; context: { close: close }" />
        </ng-template>

        <ng-template fsColumnFilter="status" panelWidth="200px" let-close>
          <ng-container *ngTemplateOutlet="statusPanel; context: { close: close }" />
        </ng-template>

        <ng-template fsColumnFilter="price" panelWidth="230px" let-close>
          <ng-container *ngTemplateOutlet="pricePanel; context: { close: close }" />
        </ng-template>

        <!-- ── Vacío ─────────────────────────────────────────────────────── -->

        <div fsTableEmpty class="demo__empty">
          <strong>No hay propiedades {{ emptyQualifier }}</strong>
          <span>Probá con otro filtro o limpiá la búsqueda para ver el listado completo.</span>
          <fs-button size="sm" variant="secondary" (click)="clearFilters()">Ver todas</fs-button>
        </div>

        <!-- ── Footer ────────────────────────────────────────────────────── -->

        <div fsTableFooter class="demo__foot">
          <span class="demo__count" role="status">
            {{ pageRows.length }} de {{ filtered.length }}
            @if (filtered.length !== all.length) { <span>filtradas · {{ all.length }} en total</span> }
            @else { <span>propiedades</span> }
          </span>
          <span class="demo__pager">
            <fs-button size="sm" variant="secondary" [disabled]="page === 0" (click)="go(-1)">Anterior</fs-button>
            <fs-button size="sm" variant="secondary" [disabled]="!hasNext" (click)="go(1)">Siguiente</fs-button>
          </span>
        </div>

      </fs-table>

      <p class="demo__log">{{ log }}</p>

      <!-- ── Hoja de filtros (mobile) ───────────────────────────────────── -->
      <fs-drawer side="bottom" size="auto" heading="Filtros" [(open)]="sheetOpen">
        <div class="demo__sheet">
          <div class="demo__sheet-group">
            <span class="demo__sheet-title">Operación</span>
            <ng-container *ngTemplateOutlet="opPanel; context: { close: noop }" />
          </div>
          <div class="demo__sheet-group">
            <span class="demo__sheet-title">Estado</span>
            <ng-container *ngTemplateOutlet="statusPanel; context: { close: noop }" />
          </div>
          <div class="demo__sheet-group">
            <span class="demo__sheet-title">Precio</span>
            <ng-container *ngTemplateOutlet="pricePanel; context: { close: noop }" />
          </div>
          <div class="demo__sheet-foot">
            <fs-button size="sm" variant="ghost" (click)="clearFilters()">Limpiar</fs-button>
            <span class="demo__bulk-spacer"></span>
            <fs-button size="sm" (click)="sheetOpen = false">Ver {{ filtered.length }} propiedades</fs-button>
          </div>
        </div>
      </fs-drawer>

    </div>

    <!-- ── Contenido de los paneles, escrito una sola vez ───────────────── -->

    <ng-template #opPanel let-close="close">
      <div class="demo__panel">
        @for (op of operations; track op) {
          <fs-checkbox [label]="operationLabel[op]" [ngModel]="opFilter.includes(op)"
                       (ngModelChange)="toggleOperation(op)" />
        }
        @if (opFilter.length) {
          <div class="demo__panel-foot">
            <fs-button size="sm" variant="ghost" (click)="clearOperation(); close()">Limpiar</fs-button>
          </div>
        }
      </div>
    </ng-template>

    <ng-template #statusPanel let-close="close">
      <div class="demo__panel">
        @for (st of statuses; track st) {
          <fs-checkbox [label]="statusLabel[st]" [ngModel]="statusFilter.includes(st)"
                       (ngModelChange)="toggleStatus(st)" />
        }
        @if (statusFilter.length) {
          <div class="demo__panel-foot">
            <fs-button size="sm" variant="ghost" (click)="clearStatus(); close()">Limpiar</fs-button>
          </div>
        }
      </div>
    </ng-template>

    <ng-template #pricePanel let-close="close">
      <div class="demo__panel">
        <!-- La moneda no es decoración: ventas en dólares y alquileres en pesos
             comparten columna, así que un rango sin moneda no quiere decir nada. -->
        <fs-segmented label="Moneda" [options]="currencyOptions"
                      [ngModel]="priceCurrency" (ngModelChange)="onCurrency($event)" />

        <div class="demo__panel-row">
          <fs-number-input label="Desde" [min]="0" [step]="1000" placeholder="0"
                           [ngModel]="priceMin" (ngModelChange)="onPrice('min', $event)" />
          <fs-number-input label="Hasta" [min]="0" [step]="1000" placeholder="Sin tope"
                           [ngModel]="priceMax" (ngModelChange)="onPrice('max', $event)" />
        </div>

        @for (preset of pricePresets; track preset.label) {
          <button type="button" class="demo__preset" (click)="applyPreset(preset)">{{ preset.label }}</button>
        }

        @if (priceActive) {
          <div class="demo__panel-foot">
            <fs-button size="sm" variant="ghost" (click)="clearPrice(); close()">Limpiar precio</fs-button>
          </div>
        }
      </div>
    </ng-template>
  `,
})
export class FsPropertiesDemoComponent {
  readonly all = PROPERTIES;
  readonly statusLabel = STATUS_LABEL;
  readonly statusColor = STATUS_COLOR;
  readonly operationLabel = OPERATION_LABEL;
  readonly operations: Operation[] = ['venta', 'alquiler'];
  readonly statuses: PropertyStatus[] = ['activa', 'borrador', 'pausada', 'reservada', 'vendida'];
  readonly noop = () => {};

  readonly currencyOptions: FsSegmentOption[] = [
    { value: 'USD', label: 'US$' },
    { value: 'ARS', label: '$' },
  ];

  readonly sortOptions: FsSelectOption[] = [
    { value: 'updated:desc', label: 'Más recientes' },
    { value: 'updated:asc',  label: 'Más antiguas' },
    { value: 'price:desc',   label: 'Mayor precio' },
    { value: 'price:asc',    label: 'Menor precio' },
    { value: 'leads:desc',   label: 'Más consultas' },
    { value: 'title:asc',    label: 'Título (A–Z)' },
  ];

  // ─── Estado ────────────────────────────────────────────────────────────────

  query = '';
  opFilter: Operation[] = [];
  statusFilter: PropertyStatus[] = [];
  priceCurrency: Currency = 'USD';
  priceMin: number | null = null;
  priceMax: number | null = null;

  sort: FsTableSort | null = { key: 'updated', dir: 'desc' };
  selected: unknown[] = [];
  sheetOpen = false;
  page = 0;
  log = '';

  @Input() density: 'comfortable' | 'compact' = 'comfortable';
  @Input() loading = false;

  filtered: Property[] = [];
  pageRows: Property[] = [];

  constructor() {
    this.apply();
  }

  // ─── Derivados ─────────────────────────────────────────────────────────────

  get priceActive(): boolean {
    return this.priceMin !== null || this.priceMax !== null;
  }

  get pricePresets() {
    return PRICE_PRESETS[this.priceCurrency];
  }

  get hasAnyFilter(): boolean {
    return !!this.query || this.opFilter.length > 0 || this.statusFilter.length > 0 || this.priceActive;
  }

  /** Lo que muestra «Filtros · N». La búsqueda no cuenta: tiene su propio campo. */
  get activeFilterCount(): number {
    return this.opFilter.length + this.statusFilter.length + (this.priceActive ? 1 : 0);
  }

  get statusChips() {
    const count = (s: PropertyStatus | 'all') =>
      s === 'all' ? this.all.length : this.all.filter(p => p.status === s).length;

    return [
      { value: 'all' as const,       label: 'Todas',      count: count('all') },
      { value: 'activa' as const,    label: 'Publicadas', count: count('activa') },
      { value: 'borrador' as const,  label: 'Borradores', count: count('borrador') },
      { value: 'pausada' as const,   label: 'Pausadas',   count: count('pausada') },
      { value: 'reservada' as const, label: 'Reservadas', count: count('reservada') },
    ];
  }

  get sortValue(): string {
    return this.sort ? `${this.sort.key}:${this.sort.dir}` : '';
  }

  get hasNext(): boolean {
    return (this.page + 1) * PAGE_SIZE < this.filtered.length;
  }

  get emptyQualifier(): string {
    if (this.query) return `para "${this.query}"`;
    if (this.statusFilter.length === 1) return STATUS_LABEL[this.statusFilter[0]].toLowerCase() + 's';
    if (this.activeFilterCount) return 'con esos filtros';
    return 'cargadas';
  }

  // ─── Filtrado ──────────────────────────────────────────────────────────────

  /**
   * Un solo lugar arma la lista: filtra, ordena y recorta la página. La tabla
   * recibe el resultado ya masticado — igual que si viniera del servidor.
   */
  apply(): void {
    const q = this.query.trim().toLowerCase();

    let rows = this.all.filter(p => {
      if (q && !p.title.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q)) return false;
      if (this.opFilter.length && !this.opFilter.includes(p.operation)) return false;
      if (this.statusFilter.length && !this.statusFilter.includes(p.status)) return false;

      // El rango solo aplica a la moneda elegida: comparar 289.000 dólares con
      // 780.000 pesos no significa nada.
      if (this.priceActive) {
        if (p.currency !== this.priceCurrency) return false;
        if (this.priceMin !== null && p.price < this.priceMin) return false;
        if (this.priceMax !== null && p.price > this.priceMax) return false;
      }
      return true;
    });

    if (this.sort) {
      const { key, dir } = this.sort;
      const sign = dir === 'asc' ? 1 : -1;
      rows = [...rows].sort((a, b) => sign * compareBy(key, a, b));
    }

    this.filtered = rows;

    const maxPage = Math.max(0, Math.ceil(rows.length / PAGE_SIZE) - 1);
    this.page = Math.min(this.page, maxPage);
    this.pageRows = rows.slice(this.page * PAGE_SIZE, (this.page + 1) * PAGE_SIZE);
  }

  /** Cambió un filtro: la página vuelve a la primera o quedás mirando el vacío. */
  private reset(): void {
    this.page = 0;
    this.apply();
  }

  onQuery(value: string): void {
    this.query = value;
    this.reset();
  }

  toggleOperation(op: Operation): void {
    this.opFilter = this.opFilter.includes(op)
      ? this.opFilter.filter(v => v !== op)
      : [...this.opFilter, op];
    this.reset();
  }

  clearOperation(): void {
    this.opFilter = [];
    this.reset();
  }

  toggleStatus(st: PropertyStatus): void {
    this.statusFilter = this.statusFilter.includes(st)
      ? this.statusFilter.filter(v => v !== st)
      : [...this.statusFilter, st];
    this.reset();
  }

  clearStatus(): void {
    this.statusFilter = [];
    this.reset();
  }

  /** El chip es un atajo del mismo filtro que el embudo de la columna Estado. */
  onChip(value: PropertyStatus | 'all'): void {
    this.statusFilter = value === 'all' ? [] : [value];
    this.reset();
  }

  chipPressed(value: PropertyStatus | 'all'): boolean {
    return value === 'all'
      ? this.statusFilter.length === 0
      : this.statusFilter.length === 1 && this.statusFilter[0] === value;
  }

  onCurrency(currency: string): void {
    this.priceCurrency = currency === 'ARS' ? 'ARS' : 'USD';
    // Un rango en dólares no quiere decir lo mismo en pesos: al cambiar de
    // moneda se limpia, en vez de filtrar por un número que ya no significa nada.
    this.priceMin = null;
    this.priceMax = null;
    this.reset();
  }

  onPrice(edge: 'min' | 'max', value: number | null): void {
    const clean = value === null || Number.isNaN(value) ? null : value;
    if (edge === 'min') this.priceMin = clean;
    else this.priceMax = clean;
    this.reset();
  }

  applyPreset(preset: { min: number | null; max: number | null }): void {
    this.priceMin = preset.min;
    this.priceMax = preset.max;
    this.reset();
  }

  clearPrice(): void {
    this.priceMin = null;
    this.priceMax = null;
    this.reset();
  }

  clearFilters(): void {
    this.query = '';
    this.opFilter = [];
    this.statusFilter = [];
    this.priceMin = null;
    this.priceMax = null;
    this.reset();
  }

  // ─── Orden ─────────────────────────────────────────────────────────────────

  /** Click en el encabezado. El select de orden lee y escribe el mismo estado. */
  onSort(next: FsTableSort | null): void {
    this.sort = next;
    this.reset();
  }

  onSortSelect(value: string): void {
    const [key, dir] = value.split(':');
    this.onSort(key ? { key, dir: dir === 'asc' ? 'asc' : 'desc' } : null);
  }

  go(delta: number): void {
    this.page += delta;
    this.apply();
  }

  // ─── Presentación ──────────────────────────────────────────────────────────

  selectLabel = (row: Property) => `Seleccionar ${row.title}`;

  money(row: Property): string {
    const symbol = row.currency === 'USD' ? 'US$' : '$';
    return `${symbol} ${row.price.toLocaleString('es-AR')}`;
  }

  day(iso: string): string {
    return new Date(iso + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
  }

  openRow(row: Property, event: Event): void {
    event.preventDefault();
    this.log = `Abrir detalle de ${row.code}`;
  }

  act(what: string, row: Property): void {
    this.log = `${what} · ${row.code}`;
  }

  bulk(what: string): void {
    this.log = `${what} sobre ${this.selected.length} propiedad(es): ${this.selected.join(', ')}`;
  }
}

function compareBy(key: string, a: Property, b: Property): number {
  const va = (a as unknown as Record<string, unknown>)[key];
  const vb = (b as unknown as Record<string, unknown>)[key];

  if (typeof va === 'number' && typeof vb === 'number') return va - vb;
  return String(va).localeCompare(String(vb), 'es', { numeric: true, sensitivity: 'base' });
}

// ─────────────────────────────────────────────────────────────────────────────

const meta: Meta<FsPropertiesDemoComponent> = {
  title: 'Compositions/PropertiesTable',
  component: FsPropertiesDemoComponent,
  decorators: [moduleMetadata({ imports: [FsPropertiesDemoComponent] })],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Backoffice de una inmobiliaria armado sobre `fs-table`.\n\n' +
          'La tabla aporta estructura, orden, selección, estados, el modo tarjeta y el ' +
          '**mecanismo** de filtro: el embudo en el encabezado, el panel anclado en el ' +
          'top layer y que haya uno solo abierto a la vez. Qué hay adentro de cada panel ' +
          'y qué se filtra con eso vive en esta composición.\n\n' +
          'Un solo estado manda. El chip de estado, el embudo de la columna Estado y la ' +
          'hoja de filtros de mobile escriben el mismo array; el select de orden y el ' +
          'click en el encabezado escriben el mismo `sort`. Por eso nunca se contradicen ' +
          '— y por eso lo mismo funciona si mañana filtra y ordena el servidor.\n\n' +
          'El filtro de precio lleva moneda porque ventas en dólares y alquileres en pesos ' +
          'comparten la columna: un rango sin moneda no significa nada.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<FsPropertiesDemoComponent>;

export const Desktop: Story = {};

export const Compact: Story = {
  name: 'Compacta',
  render: () => ({ template: `<fs-properties-demo density="compact"/>` }),
};

export const Mobile: Story = {
  name: 'Mobile — 390px',
  parameters: {
    docs: {
      description: {
        story:
          'Mismo componente, mismo estado, misma tabla. Solo cambia el ancho disponible: ' +
          'la container query pasa las filas a tarjetas y el `cardSlot` de cada columna ' +
          'decide dónde cae cada dato.\n\n' +
          'Como los embudos viven en el encabezado y el encabezado se esconde, aparece el ' +
          'botón **Filtros** que abre la misma hoja desde abajo con los tres paneles — ' +
          'literalmente los mismos templates, no una copia.',
      },
    },
  },
  render: () => ({
    template: `<div style="max-width:390px;margin-inline:auto;"><fs-properties-demo/></div>`,
  }),
};

export const Loading: Story = {
  name: 'Cargando',
  render: () => ({ template: `<fs-properties-demo [loading]="true"/>` }),
};
