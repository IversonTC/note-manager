import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-grid',
  standalone: true,
  styles: [`
    :host { display: block; }
    .dg {
      display: grid;
      grid-template-columns: repeat(var(--dg-mob-cols, 2), minmax(0, 1fr));
      grid-auto-rows: var(--dg-row-h, 110px);
    }
    @media (min-width: 640px) {
      .dg { grid-template-columns: repeat(var(--dg-cols, 6), minmax(0, 1fr)); }
    }
  `],
  template: `
    <div class="dg"
         [style.--dg-cols]="cols"
         [style.--dg-mob-cols]="mobileCols"
         [style.--dg-row-h]="rowHeight + 'px'"
         [style.gap]="gap + 'px'">
      <ng-content />
    </div>
  `,
})
export class DashboardGridComponent {
  /** Columnas base (desktop) */
  @Input() cols       = 6;
  /** Columnas en mobile (<640 px) */
  @Input() mobileCols = 2;
  /** Alto de cada unidad de fila en px */
  @Input() rowHeight  = 110;
  /** Gap entre celdas en px */
  @Input() gap        = 16;
}
