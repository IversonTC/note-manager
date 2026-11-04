import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3">
      <div *ngFor="let _ of rows"
        class="rounded-xl animate-pulse"
        [ngClass]="height"
        style="background:color-mix(in srgb,var(--color-text) 8%,transparent)">
      </div>
    </div>
  `,
})
export class SkeletonComponent {
  @Input() count = 3;
  @Input() height = 'h-14';

  get rows(): null[] {
    return Array(this.count).fill(null);
  }
}
