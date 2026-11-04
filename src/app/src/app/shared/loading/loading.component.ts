import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loading.component.html',
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}

  @Input() isLoading: boolean = false; // Para controlar cuándo se muestra la pestaña de carga
  @Input() message: string = '';
}
