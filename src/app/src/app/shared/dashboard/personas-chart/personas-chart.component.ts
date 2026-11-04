import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonaResumen } from '../../../interfaces/dashboard';

@Component({
  selector: 'app-personas-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personas-chart.component.html',
})
export class PersonasChartComponent {
  /** Lista de personas con su resumen de carga */
  @Input() personas: PersonaResumen[] = [];
  /** Título de la sección */
  @Input() titulo = 'Carga por responsable';
  /** Ícono Font Awesome para la sección */
  @Input() icono = 'fa-solid fa-users';
  /** Nombre de la persona actualmente seleccionada (para resaltar) */
  @Input() seleccionado = '';
  /** Texto del label "completadas" en la barra de progreso */
  @Input() labelProgreso = 'Completadas';
  /** Estado de carga skeleton */
  @Input() cargando = false;
  /** Número de skeletons a mostrar durante la carga */
  @Input() skeletonCount = 4;

  /** Emite el nombre al hacer clic (string vacío = deseleccionar) */
  @Output() seleccionar = new EventEmitter<string>();

  skeletons(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  toggle(nombre: string): void {
    this.seleccionar.emit(this.seleccionado === nombre ? '' : nombre);
  }
}
