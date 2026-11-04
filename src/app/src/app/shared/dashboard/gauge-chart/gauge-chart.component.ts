import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartTooltipComponent, TooltipState, emptyTooltip } from '../chart-tooltip.component';

@Component({
  selector: 'app-gauge-chart',
  standalone: true,
  imports: [CommonModule, ChartTooltipComponent],
  templateUrl: './gauge-chart.component.html',
})
export class GaugeChartComponent {
  @Input() titulo    = '';
  @Input() subtitulo = '';
  @Input() valor:  number = 0;
  @Input() maximo: number = 100;
  @Input() unidad  = '';
  @Input() color   = 'var(--color-primary)';
  @Input() cargando = false;

  readonly CX   = 100;
  readonly CY   = 100;
  readonly R    = 70;
  readonly STROKE = 10;

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

  private radAtPct(p: number): number { return (1 - p) * Math.PI; }
  get needleLen(): number { return this.R - this.STROKE - 4; }
  get needleX(): number { return this.CX + this.needleLen * Math.cos(this.radAtPct(this.pct)); }
  get needleY(): number { return this.CY - this.needleLen * Math.sin(this.radAtPct(this.pct)); }

  get colorArc(): string {
    if (this.color !== 'var(--color-primary)') return this.color;
    if (this.pct < 0.5)  return '#22c55e';
    if (this.pct < 0.75) return '#f59e0b';
    return '#ef4444';
  }

  get zonaActual(): string {
    if (this.pct < 0.5)  return 'Óptimo';
    if (this.pct < 0.75) return 'Moderado';
    return 'Crítico';
  }

  get porcentajeTexto(): string { return (this.pct * 100).toFixed(0) + '%'; }

  get ticks(): { x1: number; y1: number; x2: number; y2: number; label: string }[] {
    return [
      { p: 0,    label: '0' },
      { p: 0.25, label: '' },
      { p: 0.5,  label: '50%' },
      { p: 0.75, label: '' },
      { p: 1,    label: String(this.maximo) },
    ].map(({ p, label }) => {
      const rad = this.radAtPct(p);
      const c = Math.cos(rad), s = Math.sin(rad);
      const rIn = this.R + this.STROKE / 2 + 1;
      const rOut = rIn + 6;
      return {
        x1: this.CX + rIn * c,  y1: this.CY - rIn * s,
        x2: this.CX + rOut * c, y2: this.CY - rOut * s,
        label,
      };
    });
  }

  zoneArc(start: number, end: number): string {
    const r = this.R;
    const x1 = this.CX + r * Math.cos(this.radAtPct(start));
    const y1 = this.CY - r * Math.sin(this.radAtPct(start));
    const x2 = this.CX + r * Math.cos(this.radAtPct(end));
    const y2 = this.CY - r * Math.sin(this.radAtPct(end));
    return `M ${x1.toFixed(1)},${y1.toFixed(1)} A ${r},${r} 0 0,1 ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }

  onSvgMove(e: MouseEvent): void {
    this.containerW = window.innerWidth;
    this.tooltip.x  = e.clientX;
    this.tooltip.y  = e.clientY;
  }

  onSvgEnter(): void {
    this.tooltip.visible = true;
    this.tooltip.titulo  = this.titulo || 'Indicador';
    this.tooltip.lineas  = [
      { label: 'Valor',   valor: `${this.valor.toLocaleString()}${this.unidad ? ' ' + this.unidad : ''}`, color: this.colorArc },
      { label: 'Máximo',  valor: this.maximo.toLocaleString() },
      { label: 'Porcentaje', valor: this.porcentajeTexto },
      { label: 'Zona',    valor: this.zonaActual },
    ];
  }

  onLeave(): void { this.tooltip.visible = false; }
}
