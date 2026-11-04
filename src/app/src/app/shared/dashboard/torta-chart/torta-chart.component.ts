import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonaSegmento } from '../../../interfaces/dashboard';
import { ChartTooltipComponent, TooltipState, emptyTooltip } from '../chart-tooltip.component';
import { ChartColorsService } from '../../../services/chart-colors.service';

interface SegmentoTorta extends DonaSegmento {
  pct: number;
  startAngle: number;
  endAngle: number;
}

@Component({
  selector: 'app-torta-chart',
  standalone: true,
  imports: [CommonModule, ChartTooltipComponent],
  templateUrl: './torta-chart.component.html',
})
export class TortaChartComponent {
  private colors = inject(ChartColorsService);

  @Input() titulo    = '';
  @Input() segmentos: DonaSegmento[] = [];
  @Input() cargando  = false;

  /**
   * 'clasica'  — torta + leyenda con barras a la derecha (celdas anchas)
   * 'compacta' — torta + chips debajo, % inline sobre cada slice grande
   * 'minima'   — solo la torta, sin leyenda, para celdas pequeñas
   */
  @Input() variante: 'clasica' | 'compacta' | 'minima' = 'clasica';
  @Input() layout: 'row' | 'col' = 'row';

  readonly CX = 60;
  readonly CY = 60;
  readonly R  = 56;

  tooltip: TooltipState = emptyTooltip();
  containerW = 0;

  get total(): number {
    const t = this.segmentos.reduce((s, i) => s + i.valor, 0);
    return t === 0 ? 1 : t;
  }

  get segmentosCalc(): SegmentoTorta[] {
    let angle = 0;
    return this.segmentos.map((seg, i) => {
      const color      = this.colors.resolve(seg.label, seg.color, i);
      const pct        = seg.valor / this.total;
      const startAngle = angle;
      const endAngle   = angle + pct * 360;
      angle = endAngle;
      return { ...seg, color, pct, startAngle, endAngle };
    });
  }

  private polar(angleDeg: number): { x: number; y: number } {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: this.CX + this.R * Math.cos(rad), y: this.CY + this.R * Math.sin(rad) };
  }

  slicePath(seg: SegmentoTorta): string {
    // Tiny gap between slices: shrink arc slightly
    const gap = 0.6;
    const s = this.polar(seg.startAngle + gap);
    const e = this.polar(seg.endAngle   - gap);
    const large = (seg.endAngle - seg.startAngle) > 180 ? 1 : 0;
    return `M ${this.CX} ${this.CY} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${this.R} ${this.R} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`;
  }

  /** Label position inside the slice (at 62% of radius) */
  labelX(seg: SegmentoTorta): number {
    const mid = (seg.startAngle + seg.endAngle) / 2;
    const rad = (mid - 90) * Math.PI / 180;
    return this.CX + this.R * 0.62 * Math.cos(rad);
  }
  labelY(seg: SegmentoTorta): number {
    const mid = (seg.startAngle + seg.endAngle) / 2;
    const rad = (mid - 90) * Math.PI / 180;
    return this.CY + this.R * 0.62 * Math.sin(rad);
  }

  onSvgMove(e: MouseEvent): void {
    this.containerW = window.innerWidth;
    this.tooltip.x  = e.clientX;
    this.tooltip.y  = e.clientY;
  }

  onSegHover(seg: SegmentoTorta): void {
    this.tooltip.visible = true;
    this.tooltip.titulo  = seg.label;
    this.tooltip.lineas  = [
      { label: 'Cantidad',  valor: seg.valor.toLocaleString(), color: seg.color },
      { label: 'Del total', valor: (seg.pct * 100).toFixed(1) + '%' },
    ];
  }

  onLeave(): void { this.tooltip.visible = false; }
}
