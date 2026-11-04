import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card.component.html',
})
export class KpiCardComponent {
  @Input() titulo = '';
  @Input() valor: number | string = 0;
  @Input() icono = '';
  @Input() color = '';
  @Input() subtitulo = '';
  @Input() tendencia: number | null = null;
  @Input() cargando = false;

  get colorFondo(): string {
    if (this.color.startsWith('#')) {
      return this.color + '20';
    }
    return 'color-mix(in srgb,var(--color-primary) 12%,transparent)';
  }

  get colorIcono(): string {
    return this.color || 'var(--color-primary)';
  }
}
