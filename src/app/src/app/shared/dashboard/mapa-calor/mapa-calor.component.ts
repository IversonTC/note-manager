import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartTooltipComponent, TooltipState, emptyTooltip } from '../chart-tooltip.component';

@Component({
  selector: 'app-mapa-calor',
  standalone: true,
  imports: [CommonModule, ChartTooltipComponent],
  templateUrl: './mapa-calor.component.html',
})
export class MapaCalorComponent {
  @Input() titulo    = '';
  @Input() icono     = 'fa-solid fa-border-all';
  @Input() cargando  = false;
  @Input() filas:    string[] = [];
  @Input() columnas: string[] = [];
  /** datos[fila][columna] */
  @Input() datos: number[][] = [];
  /** Texto para el tooltip al describir el valor (p.ej. "tickets") */
  @Input() unidad = '';
  /** Mostrar el número dentro de cada celda */
  @Input() mostrarValor = false;
  /** Color base de las celdas calientes — por defecto usa --color-primary */
  @Input() color = 'var(--color-primary)';

  tooltip: TooltipState = emptyTooltip();

  get maxVal(): number {
    let m = 0;
    for (const row of this.datos)
      for (const v of row)
        if (v > m) m = v;
    return m < 1 ? 1 : m;
  }

  get gridCols(): string {
    return `auto repeat(${this.columnas.length}, minmax(0,1fr))`;
  }

  cellOpacity(r: number, c: number): number {
    const v = this.datos[r]?.[c] ?? 0;
    return (v / this.maxVal) * 0.82 + 0.06;
  }

  cellValue(r: number, c: number): number {
    return this.datos[r]?.[c] ?? 0;
  }

  onCellHover(e: MouseEvent, r: number, c: number): void {
    const val = this.cellValue(r, c);
    this.tooltip.visible = true;
    this.tooltip.x = e.clientX;
    this.tooltip.y = e.clientY;
    this.tooltip.titulo = `${this.filas[r]} · ${this.columnas[c]}`;
    this.tooltip.lineas = [
      { label: 'Valor', valor: val.toLocaleString() + (this.unidad ? ' ' + this.unidad : ''), color: this.color },
      { label: 'Intensidad', valor: (this.cellOpacity(r, c) * 100).toFixed(0) + '%' },
    ];
  }

  onMove(e: MouseEvent): void {
    this.tooltip.x = e.clientX;
    this.tooltip.y = e.clientY;
  }

  onLeave(): void { this.tooltip.visible = false; }

  skeletons = Array.from({ length: 4 });
  skeletonCols = Array.from({ length: 6 });
}
