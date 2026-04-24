import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsBadgeComponent, FsBadgeColor } from '../badge/badge.component';

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
   * Ejemplo: 'https://cdn.simpleicons.org/linkedin/white'
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
  iconLeft?:    string;
  imgLeft?:     string;
  imgLeftAlt?:  string;
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
   * Resuelve el href de un link.
   * Si tiene encodedEmail, lo decodifica con atob() y retorna 'mailto:email'.
   * Si tiene url, la retorna directamente.
   * Si no tiene ninguno, retorna null.
   */
  getLinkHref(link: FsProfileLink): string | null {
    if (link.encodedEmail) {
      try {
        return 'mailto:' + atob(link.encodedEmail);
      } catch {
        return null;
      }
    }
    return link.url ?? null;
  }
}
