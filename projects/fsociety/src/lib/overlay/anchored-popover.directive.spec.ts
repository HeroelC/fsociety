import { Component, ViewChild, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  FsAnchoredPopoverDirective,
  FsPopoverSheet,
  FS_POPOVER_SHEET_QUERY,
} from './anchored-popover.directive';

@Component({
  standalone: true,
  imports: [FsAnchoredPopoverDirective],
  template: `
    <div #anchor class="anchor"></div>
    <div
      #pop
      class="pop"
      [fsAnchoredPopover]="anchor"
      [popoverSheet]="sheet"
    >contenido</div>
  `,
  styles: [
    `.anchor { position: fixed; top: 400px; left: 20px; width: 200px; height: 40px; }`,
    `.pop { height: 300px; }`,
  ],
})
class HostComponent {
  @ViewChild('pop', { static: true }) pop!: ElementRef<HTMLElement>;
  sheet: FsPopoverSheet = 'never';
}

/**
 * Stub de matchMedia. La directiva consulta el media query una sola vez por
 * llamada a `position()`, así que alcanza con devolver un objeto con `matches`
 * fijo por test.
 */
function stubMatchMedia(matches: boolean): jasmine.Spy {
  return spyOn(window, 'matchMedia').and.returnValue({
    matches,
    media: FS_POPOVER_SHEET_QUERY,
    addEventListener: () => {},
    removeEventListener: () => {},
  } as unknown as MediaQueryList);
}

/** Simula el teclado achicando el viewport visual sin tocar el de layout. */
function stubVisualViewport(height: number, offsetTop = 0): void {
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: { height, offsetTop, addEventListener: () => {}, removeEventListener: () => {} },
  });
}

describe('FsAnchoredPopoverDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  async function build(sheet: FsPopoverSheet): Promise<HTMLElement> {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.sheet = sheet;
    fixture.detectChanges();
    return fixture.componentInstance.pop.nativeElement;
  }

  afterEach(() => {
    delete (window as { visualViewport?: unknown }).visualViewport;
  });

  describe('modo anclado', () => {
    it('posiciona con estilos inline y no marca el atributo de sheet', async () => {
      stubMatchMedia(false);
      const pop = await build('never');

      expect(pop.dataset['fsPopover']).toBeUndefined();
      expect(pop.style.top).not.toBe('');
      expect(pop.style.left).not.toBe('');
    });

    it('ignora el viewport chico cuando popoverSheet es "never"', async () => {
      // El default no cambia de comportamiento aunque el media query dé match:
      // ningún consumidor existente se convierte en hoja sin pedirlo.
      stubMatchMedia(true);
      const pop = await build('never');

      expect(pop.dataset['fsPopover']).toBeUndefined();
      expect(pop.style.top).not.toBe('');
    });
  });

  describe('modo sheet', () => {
    it('marca el atributo y borra los estilos inline de posición', async () => {
      // Los inline styles le ganan a cualquier regla de la hoja, así que si no
      // se limpian el CSS del sheet nunca puede tomar el control.
      stubMatchMedia(true);
      const pop = await build('auto');

      expect(pop.dataset['fsPopover']).toBe('sheet');
      expect(pop.style.top).toBe('');
      expect(pop.style.left).toBe('');
      expect(pop.style.width).toBe('');
    });

    it('no se activa cuando el viewport no da match', async () => {
      stubMatchMedia(false);
      const pop = await build('auto');

      expect(pop.dataset['fsPopover']).toBeUndefined();
      expect(pop.style.top).not.toBe('');
    });

    it('publica el alto del teclado como custom property', async () => {
      // El teclado achica el viewport visual pero no el de layout: la
      // diferencia es lo que la hoja tiene que descontar por `bottom`.
      stubMatchMedia(true);
      stubVisualViewport(window.innerHeight - 232);
      const pop = await build('auto');

      expect(pop.style.getPropertyValue('--fs-popover-keyboard')).toBe('232px');
    });

    it('publica 0px cuando el teclado está cerrado', async () => {
      stubMatchMedia(true);
      stubVisualViewport(window.innerHeight);
      const pop = await build('auto');

      expect(pop.style.getPropertyValue('--fs-popover-keyboard')).toBe('0px');
    });

    it('nunca publica un inset negativo', async () => {
      // Safari puede reportar un visualViewport más alto que innerHeight
      // mientras se retrae la barra de direcciones.
      stubMatchMedia(true);
      stubVisualViewport(window.innerHeight + 60);
      const pop = await build('auto');

      expect(pop.style.getPropertyValue('--fs-popover-keyboard')).toBe('0px');
    });
  });

  describe('vuelta de sheet a anclado', () => {
    it('limpia el atributo y la custom property al ensanchar el viewport', async () => {
      const mql = { matches: true, media: FS_POPOVER_SHEET_QUERY } as MediaQueryList;
      spyOn(window, 'matchMedia').and.returnValue(mql);
      const pop = await build('auto');
      expect(pop.dataset['fsPopover']).toBe('sheet');

      // El viewport se ensancha: la próxima medición debe volver al anclaje.
      (mql as { matches: boolean }).matches = false;
      window.dispatchEvent(new Event('resize'));

      expect(pop.dataset['fsPopover']).toBeUndefined();
      expect(pop.style.getPropertyValue('--fs-popover-keyboard')).toBe('');
      expect(pop.style.top).not.toBe('');
    });
  });
});
