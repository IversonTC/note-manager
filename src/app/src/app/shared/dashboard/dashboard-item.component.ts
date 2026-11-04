import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-item',
  standalone: true,
  template: `<ng-content />`,
})
export class DashboardItemComponent {
  /** Columnas que ocupa (unidades del grid padre) */
  @Input() cols = 1;
  /** Filas que ocupa (unidades del grid padre) */
  @Input() rows = 1;

  @HostBinding('style.grid-column') get gc() { return `span ${this.cols}`; }
  @HostBinding('style.grid-row')    get gr() { return `span ${this.rows}`; }
  @HostBinding('style.display')    readonly d  = 'block';
  @HostBinding('style.min-width')  readonly mw = '0';
  @HostBinding('style.min-height') readonly mh = '0';
  @HostBinding('style.height')     readonly h  = '100%';
  @HostBinding('style.overflow')   readonly ov = 'hidden';
}
