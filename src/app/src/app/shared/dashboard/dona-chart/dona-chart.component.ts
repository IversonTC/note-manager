import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonaSegmento } from '../../../interfaces/dashboard';
import { ChartTooltipComponent, TooltipState, emptyTooltip } from '../chart-tooltip.component';
import { ChartColorsService } from '../../../services/chart-colors.service';

interface SegmentoCalc extends DonaSegmento {
  pct: number;
  dasharray: string;
  dashoffset: number;
}

/** Gap visual en unidades SVG entre segmentos adyacentes */
const SEG_GAP = 2.5;

@Component({
  selector: 'app-dona-chart',
  standalone: true,
  imports: [CommonModule, ChartTooltipComponent],
  templateUrl: './dona-chart.component.html',
})
export class DonaChartComponent {
  private colors = inject(ChartColorsService);

  @Input() titulo       = '';
  @Input() segmentos: DonaSegmento[] = [];
  @Input() centroLabel  = '';
  @Input() centroSub    = '';
  @Input() cargando     = false;

  /**
   * 'clasica'   — donut + leyenda lateral/inferior (layout controlado por [layout])
   * 'compacta'  — donut grande centrado + chips de leyenda abajo
   * 'minima'    — solo el donut, sin leyenda (ideal para celdas pequeñas)
   */
  @Input() variante: 'clasica' | 'compacta' | 'minima' = 'clasica';

  /**
   * Solo aplica en variante 'clasica':
   * 'row' — donut izquierda, leyenda derecha (bueno para celdas anchas: 3×2, 4×2)
   * 'col' — donut arriba, leyenda abajo (bueno para celdas cuadradas: 2×2, 3×3)
   */
  @Input() layout: 'row' | 'col' = 'row';

  readonly R  = 45;
  readonly CX = 60;
  readonly CY = 60;
  readonly CIRCUNFERENCIA = 2 * Math.PI * 45;

  tooltip: TooltipState = emptyTooltip();
  containerW = 0;

  get total(): number {
    const t = this.segmentos.reduce((s, i) => s + i.valor, 0);
    return t === 0 ? 1 : t;
  }

  get segmentosCalc(): SegmentoCalc[] {
    const n = this.segmentos.length;
    let offset = 0;
    return this.segmentos.map((seg, i) => {
      const color    = this.colors.resolve(seg.label, seg.color, i);
      const pct      = seg.valor / this.total;
      const dashFull = pct * this.CIRCUNFERENCIA;
      // Gap visual entre segmentos adyacentes — solo si el segmento es lo suficientemente grande
      const gap  = n > 1 && dashFull > SEG_GAP * 3 ? SEG_GAP : 0;
      const dash = Math.max(0.01, dashFull - gap);
      // ⚠️ El gap en dasharray DEBE ser (CIRC - dash) para que el patrón tenga
      //    longitud exacta = CIRC. Con CIRC como gap, el patrón sería dash+CIRC,
      //    lo que desplaza todos los segmentos incorrectamente con datos reales.
      const dasharray  = `${dash} ${this.CIRCUNFERENCIA - dash}`;
      const dashoffset = this.CIRCUNFERENCIA - offset;
      offset += dashFull;
      return { ...seg, color, pct, dasharray, dashoffset };
    });
  }

  onSvgMove(e: MouseEvent): void {
    this.containerW = window.innerWidth;
    this.tooltip.x  = e.clientX;
    this.tooltip.y  = e.clientY;
  }

  onSegHover(seg: SegmentoCalc): void {
    this.tooltip.visible = true;
    this.tooltip.titulo  = seg.label;
    this.tooltip.lineas  = [
      { label: 'Cantidad',  valor: seg.valor.toLocaleString(), color: seg.color },
      { label: 'Del total', valor: (seg.pct * 100).toFixed(1) + '%' },
    ];
  }

  onLeave(): void { this.tooltip.visible = false; }

  /** Posición X del label inline de un segmento (variante compacta) */
  labelX(seg: SegmentoCalc): number {
    const angle = ((seg.dashoffset / this.CIRCUNFERENCIA) - seg.pct / 2) * 2 * Math.PI - Math.PI / 2;
    return this.CX + this.R * Math.cos(angle);
  }

  /** Posición Y del label inline de un segmento (variante compacta) */
  labelY(seg: SegmentoCalc): number {
    const angle = ((seg.dashoffset / this.CIRCUNFERENCIA) - seg.pct / 2) * 2 * Math.PI - Math.PI / 2;
    return this.CY + this.R * Math.sin(angle);
  }
}
