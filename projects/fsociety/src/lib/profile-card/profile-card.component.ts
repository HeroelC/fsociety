import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsBadgeComponent, FsBadgeColor } from '../badge/badge.component';
import { FsCorners } from '../corners';

export interface FsProfileStat {
  value: string | number;
  label: string;
}

export interface FsProfileLink {
  /** Texto visible */
  label: string;
  /** URL destino — se ignora si hay encodedEmail */
  url?: string;
  /**
   * Email codificado en base64 — tiene prioridad sobre url.
   * Generá el valor con btoa('tu@email.com') en la consola del browser.
   * El componente lo decodifica en runtime con atob() — nunca aparece
   * el mailto: en el HTML estático, protegiéndolo de email scrapers.
   * Ejemplo: btoa('johndoe@example.com') → 'am9obmRvZUBleGFtcGxlLmNvbQ=='
   */
  encodedEmail?: string;
  /** SVG path del ícono (viewBox 0 0 16 16) — se ignora si hay imgUrl */
  icon?: string;
  /**
   * URL o ruta de imagen para el ícono del link.
   * Ejemplo: 'https://api.iconify.design/simple-icons:linkedin.svg'
   * Tiene prioridad sobre icon si ambos están definidos.
   */
  imgUrl?: string;
  /** Alt text para imgUrl — por defecto vacío (decorativo) */
  imgAlt?: string;
}

export interface FsProfileBadge {
  label:        string;
  color?:       FsBadgeColor;
  customColor?: string;
  /** URL completa del ícono, igual que en `fs-badge`. */
  iconLeft?:    string;
}

@Component({
  selector: 'fs-profile-card',
  standalone: true,
  imports: [CommonModule, FsBadgeComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsProfileCardComponent {

  @Input() name = '';
  @Input() handle = '';
  @Input() role = '';
  @Input() verified = false;
  @Input() avatarUrl?: string;
  @Input() bannerUrl?: string;
  @Input() links: FsProfileLink[] = [];
  @Input() badges: FsProfileBadge[] = [];
  @Input() stats: FsProfileStat[] = [];
  @Input() showActions = false;
  @Input() primaryActionLabel = 'Seguir';
  @Input() secondaryActionLabel = 'Mensaje';

  /**
   * Qué esquinas van redondeadas. Sirve para apoyar el componente contra otra
   * cosa sin que quede una esquina redonda adentro de otra.
   *
   * `start` y `end` son lógicas: en RTL se dan vuelta solas.
   */
  @Input() corners: FsCorners = 'all';

  @Output() primaryAction   = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  get initials(): string {
    return this.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  /**
   * Resuelve el href de un link normal (no email).
   * Para emails usar handleLinkClick() — nunca poner mailto: en el DOM.
   */
  getLinkHref(link: FsProfileLink): string {
    if (link.encodedEmail) return '#';
    return link.url ?? '#';
  }

  /**
   * Maneja el click de un link.
   * Si tiene encodedEmail, decodifica en runtime y navega vía window.location.
   * El mailto: nunca aparece en el DOM.
   */
  handleLinkClick(event: MouseEvent, link: FsProfileLink): void {
    if (!link.encodedEmail) return;
    event.preventDefault();
    try {
      window.location.href = 'mailto:' + atob(link.encodedEmail);
    } catch {
      // silently fail
    }
  }

  /**
   * Resuelve el label visible de un link.
   * Si tiene encodedEmail, invierte el texto — CSS direction:rtl
   * lo muestra al derecho para el usuario pero el DOM tiene el string
   * invertido, dificultando scrapers de texto.
   */
  getLinkLabel(link: FsProfileLink): string {
    if (link.encodedEmail) {
      try {
        return atob(link.encodedEmail).split('').reverse().join('');
      } catch {
        return link.label;
      }
    }
    return link.label;
  }

  /** Verdadero si el link muestra un email (para aplicar la clase RTL) */
  isEmailLink(link: FsProfileLink): boolean {
    return !!link.encodedEmail;
  }
}
