import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartTooltipComponent, TooltipState, emptyTooltip } from '../chart-tooltip.component';

@Component({
  selector: 'app-arc-progress',
  standalone: true,
  imports: [CommonModule, ChartTooltipComponent],
  templateUrl: './arc-progress.component.html',
})
export class ArcProgressComponent {
  @Input() titulo    = '';
  @Input() subtitulo = '';
  @Input() valor:  number = 0;
  @Input() maximo: number = 100;
  @Input() unidad  = '';
  @Input() color   = 'var(--color-primary)';
  @Input() cargando = false;

  readonly CX     = 100;
  readonly CY     = 95;
  readonly R      = 68;
  readonly STROKE = 14;

  tooltip: TooltipState = emptyTooltip();
  containerW = 0;

  get arcLen(): number { return Math.PI * this.R; }

  get pct(): number {
    if (this.maximo <= 0) return 0;
    return Math.min(1, Math.max(0, this.valor / this.maximo));
  }

  get dashFilled(): string {
    const filled = this.pct * this.arcLen;
    return `${filled.toFixed(2)} ${this.arcLen.toFixed(2)}`;
  }

  get arcD(): string {
    return `M ${this.CX - this.R},${this.CY} A ${this.R},${this.R} 0 0,1 ${this.CX + this.R},${this.CY}`;
  }

  get porcentajeTexto(): string { return (this.pct * 100).toFixed(0) + '%'; }

  get dotX(): number { return this.CX + this.R * Math.cos((1 - this.pct) * Math.PI); }
  get dotY(): number { return this.CY - this.R * Math.sin((1 - this.pct) * Math.PI); }

  onSvgMove(e: MouseEvent): void {
    this.containerW = window.innerWidth;
    this.tooltip.x  = e.clientX;
    this.tooltip.y  = e.clientY;
  }

  onSvgEnter(): void {
    const restante = this.maximo - this.valor;
    this.tooltip.visible = true;
    this.tooltip.titulo  = this.titulo || 'Progreso';
    this.tooltip.lineas  = [
      { label: 'Completado', valor: `${this.valor.toLocaleString()}${this.unidad ? ' ' + this.unidad : ''}`, color: this.color },
      { label: 'Restante',   valor: `${restante.toLocaleString()}${this.unidad ? ' ' + this.unidad : ''}` },
      { label: 'Total',      valor: this.maximo.toLocaleString() },
      { label: 'Avance',     valor: this.porcentajeTexto },
    ];
  }

  onLeave(): void { this.tooltip.visible = false; }
}
