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
  /** Valor principal: '4+', '985', '12' */
  value: string | number;
  /** Etiqueta debajo del valor */
  label: string;
}

export interface FsProfileLink {
  /** Texto visible */
  label: string;
  /** URL destino */
  url?: string;
  /** SVG path del ícono (viewBox 0 0 16 16) */
  icon?: string;
}

export interface FsProfileBadge {
  label:     string;
  color?:    FsBadgeColor;
  iconLeft?: string;
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

  // -------------------------------------------------------------------------
  // Identidad
  // -------------------------------------------------------------------------

  /** Nombre completo */
  @Input() name = '';

  /** Handle sin @ */
  @Input() handle = '';

  /** Rol / título */
  @Input() role = '';

  /** Muestra el badge de verificado */
  @Input() verified = false;

  // -------------------------------------------------------------------------
  // Imágenes
  // -------------------------------------------------------------------------

  /**
   * URL de la foto de perfil.
   * Si no se provee, se muestran las iniciales.
   */
  @Input() avatarUrl?: string;

  /**
   * URL de imagen para el banner.
   * Si no se provee, se usa el degradé navy por defecto.
   */
  @Input() bannerUrl?: string;

  // -------------------------------------------------------------------------
  // Contenido
  // -------------------------------------------------------------------------

  /** Links de redes sociales / ubicación */
  @Input() links: FsProfileLink[] = [];

  /** Badges de tecnologías */
  @Input() badges: FsProfileBadge[] = [];

  /**
   * Stats configurables: años de exp., proyectos, seguidores, etc.
   * Array de { value, label } — se muestran todos en el footer.
   */
  @Input() stats: FsProfileStat[] = [];

  // -------------------------------------------------------------------------
  // Variante
  // -------------------------------------------------------------------------

  /**
   * Muestra los botones de acción (Seguir / Mensaje).
   * false = variante readonly / portfolio propio.
   */
  @Input() showActions = false;

  /** Label del botón primario */
  @Input() primaryActionLabel = 'Seguir';

  /** Label del botón secundario */
  @Input() secondaryActionLabel = 'Mensaje';

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  @Output() primaryAction   = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  get initials(): string {
    return this.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }
}
