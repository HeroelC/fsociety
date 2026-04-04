import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsBadgeComponent, FsBadgeColor } from '../badge/badge.component';

export interface FsExperienceBadge {
  label: string;
  color?: FsBadgeColor;
  iconLeft?: string;
}

export interface FsExperienceCard {
  /** Nombre de la empresa */
  company: string;

  /** Rol / puesto */
  role: string;

  /** Fecha de inicio — formato libre: 'abr 2022' */
  startDate: string;

  /** Fecha de fin — omitir si es trabajo actual */
  endDate?: string;

  /** Marca el trabajo como actual — muestra dot verde y "actualidad" */
  current?: boolean;

  /** Logo de la empresa — URL de imagen */
  logoUrl?: string;

  /** Texto corto para el logo cuando no hay imagen: 'X CALE' */
  logoText?: string;

  /** Lista de responsabilidades / bullets */
  bullets?: string[];

  /** Cuántos bullets mostrar antes del "ver más" */
  bulletsPreview?: number;

  /** Badges de tecnologías */
  badges?: FsExperienceBadge[];
}

@Component({
  selector: 'fs-experience-card',
  standalone: true,
  imports: [CommonModule, FsBadgeComponent],
  templateUrl: './experience-card.component.html',
  styleUrl: './experience-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsExperienceCardComponent implements OnInit {

  /** Datos de la experiencia */
  @Input() experience!: FsExperienceCard;

  /** Variante de presentación */
  @Input() variant: 'full' | 'compact' = 'full';

  /** Muestra la línea vertical de timeline a la izquierda */
  @Input() timeline = false;

  /** Si es el último item del timeline (no dibuja la línea hacia abajo) */
  @Input() timelineLast = false;

  expanded = false;

  get hasBullets(): boolean {
    return !!(this.experience?.bullets?.length);
  }

  get visibleBullets(): string[] {
    if (!this.experience?.bullets) return [];
    const preview = this.experience.bulletsPreview ?? 3;
    return this.expanded
      ? this.experience.bullets
      : this.experience.bullets.slice(0, preview);
  }

  get hasMoreBullets(): boolean {
    if (!this.experience?.bullets) return false;
    const preview = this.experience.bulletsPreview ?? 3;
    return this.experience.bullets.length > preview;
  }

  get duration(): string {
    return this.calculateDuration();
  }

  get isCurrent(): boolean {
    return this.experience?.current ?? false;
  }

  ngOnInit(): void {
    this.expanded = false;
  }

  toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  private calculateDuration(): string {
    if (!this.experience?.startDate) return '';

    const start = this.parseDate(this.experience.startDate);
    const end   = this.experience.current || !this.experience.endDate
      ? new Date()
      : this.parseDate(this.experience.endDate);

    if (!start || !end) return '';

    let months = (end.getFullYear() - start.getFullYear()) * 12
               + (end.getMonth() - start.getMonth());

    const years  = Math.floor(months / 12);
    const remain = months % 12;

    const parts: string[] = [];
    if (years > 0)  parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
    if (remain > 0) parts.push(`${remain} ${remain === 1 ? 'mes' : 'meses'}`);

    return parts.join(' ');
  }

  private parseDate(dateStr: string): Date | null {
    const months: Record<string, number> = {
      ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
      jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
    };

    const parts = dateStr.trim().toLowerCase().split(' ');
    if (parts.length === 2) {
      const month = months[parts[0]];
      const year  = parseInt(parts[1], 10);
      if (month !== undefined && !isNaN(year)) {
        return new Date(year, month, 1);
      }
    }

    // fallback: intentar parsear como fecha estándar
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }
}
