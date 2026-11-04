import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { TareasService } from '../../../services/tareas.service';
import { ColaboradoresService, ColaboradorApi } from '../../../services/colaboradores.service';
import { Equipo, MiembroEquipo } from '../../../interfaces/tareas';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipos.component.html',
})
export class EquiposComponent implements OnInit, OnDestroy {
  private svc      = inject(TareasService);
  private colabSvc = inject(ColaboradoresService);


  // ── Colores disponibles para equipo ──────────────────────────────────────
  readonly colores = [
    '#3b82f6', '#22c55e', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1',
  ];

  // ── Lista de equipos ──────────────────────────────────────────────────────
  equipos: Equipo[] = [];
  cargando = false;
  buscar   = '';

  // ── Panel lateral de miembros ─────────────────────────────────────────────
  equipoActivo: Equipo | null = null;
  miembros: MiembroEquipo[]   = [];
  cargandoMiembros            = false;

  // ── Búsqueda de colaboradores para agregar ────────────────────────────────
  buscarColabTexto    = '';
  colabSugeridos: ColaboradorApi[] = [];
  buscandoColab       = false;
  private buscar$     = new Subject<string>();
  private subs        = new Subscription();

  // ── Modal crear/editar equipo ─────────────────────────────────────────────
  modalAbierto   = false;
  guardando      = false;
  errorGuardar   = '';
  editandoId: number | null = null;
  form = this.formVacio();

  // ── Modal confirmar eliminar equipo ───────────────────────────────────────
  modalEliminar      = false;
  equipoAEliminar: Equipo | null = null;
  eliminando         = false;

  // ── Toasts ────────────────────────────────────────────────────────────────
  toasts: { id: number; tipo: 'ok' | 'error'; msg: string }[] = [];
  private toastId = 0;

  // ─────────────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.cargar();

    const sub = this.buscar$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        this.buscandoColab = true;
        return this.colabSvc.getAliados({ buscar: q, porPagina: 10, estado: 1 });
      }),
    ).subscribe({
      next: res => { this.colabSugeridos = res.items; this.buscandoColab = false; },
      error: ()  => { this.buscandoColab = false; },
    });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.buscar$.complete();
  }

  // ── Carga equipos ─────────────────────────────────────────────────────────

  cargar(): void {
    this.cargando = true;
    this.svc.listarEquipos().subscribe({
      next: data => { this.equipos = data ?? []; this.cargando = false; },
      error: ()   => { this.cargando = false; },
    });
  }

  get equiposFiltrados(): Equipo[] {
    const q = this.buscar.trim().toLowerCase();
    if (!q) return this.equipos;
    return this.equipos.filter(e =>
      e.nombre.toLowerCase().includes(q) ||
      (e.descripcion ?? '').toLowerCase().includes(q)
    );
  }

  // ── Panel de miembros ─────────────────────────────────────────────────────

  abrirPanel(eq: Equipo): void {
    this.equipoActivo       = eq;
    this.miembros           = [];
    this.buscarColabTexto   = '';
    this.colabSugeridos     = [];
    this.cargandoMiembros   = true;

    this.svc.listarMiembrosEquipo(eq.id).subscribe({
      next: data => { this.miembros = data ?? []; this.cargandoMiembros = false; },
      error: ()   => { this.cargandoMiembros = false; },
    });
  }

  cerrarPanel(): void {
    this.equipoActivo     = null;
    this.miembros         = [];
    this.buscarColabTexto = '';
    this.colabSugeridos   = [];
  }

  // ── Búsqueda colaboradores ────────────────────────────────────────────────

  onBuscarColab(q: string): void {
    this.buscarColabTexto = q;
    this.colabSugeridos   = [];
    if (q.trim().length >= 2) this.buscar$.next(q.trim());
  }

  yaMiembro(codigo: string): boolean {
    return this.miembros.some(m => m.codigo === codigo);
  }

  agregarMiembro(colab: ColaboradorApi): void {
    if (!this.equipoActivo || this.yaMiembro(colab.codigo)) return;
    this.svc.agregarMiembroEquipo(this.equipoActivo.id, { codigo: colab.codigo, rol: 'miembro' }).subscribe({
      next: m => {
        this.miembros = [...this.miembros, m];
        this.buscarColabTexto = '';
        this.colabSugeridos   = [];
        this.toast('ok', `${colab.nombre} agregado al equipo.`);
        // Actualizar contador
        if (this.equipoActivo) {
          this.equipoActivo = {
            ...this.equipoActivo,
            total_miembros: (this.equipoActivo.total_miembros ?? 0) + 1,
          };
          this.equipos = this.equipos.map(e =>
            e.id === this.equipoActivo!.id ? this.equipoActivo! : e
          );
        }
      },
      error: e => this.toast('error', e?.error?.message ?? 'No se pudo agregar el miembro.'),
    });
  }

  quitarMiembro(m: MiembroEquipo): void {
    if (!this.equipoActivo) return;
    this.svc.quitarMiembroEquipo(this.equipoActivo.id, m.codigo).subscribe({
      next: () => {
        this.miembros = this.miembros.filter(x => x.codigo !== m.codigo);
        this.toast('ok', `${m.nombre} eliminado del equipo.`);
        if (this.equipoActivo) {
          this.equipoActivo = {
            ...this.equipoActivo,
            total_miembros: Math.max(0, (this.equipoActivo.total_miembros ?? 1) - 1),
          };
          this.equipos = this.equipos.map(e =>
            e.id === this.equipoActivo!.id ? this.equipoActivo! : e
          );
        }
      },
      error: e => this.toast('error', e?.error?.message ?? 'No se pudo quitar el miembro.'),
    });
  }

  cambiarRol(m: MiembroEquipo, rol: 'admin' | 'miembro'): void {
    if (!this.equipoActivo) return;
    this.svc.agregarMiembroEquipo(this.equipoActivo.id, { codigo: m.codigo, rol }).subscribe({
      next: updated => {
        this.miembros = this.miembros.map(x => x.codigo === m.codigo ? updated : x);
        this.toast('ok', 'Rol actualizado.');
      },
      error: e => this.toast('error', e?.error?.message ?? 'Error actualizando rol.'),
    });
  }

  // ── Modal crear/editar ────────────────────────────────────────────────────

  abrirModalCrear(): void {
    this.editandoId   = null;
    this.form         = this.formVacio();
    this.errorGuardar = '';
    this.modalAbierto = true;
  }

  abrirModalEditar(eq: Equipo, event: Event): void {
    event.stopPropagation();
    this.editandoId = eq.id;
    this.form = {
      nombre:      eq.nombre,
      descripcion: eq.descripcion ?? '',
      color:       eq.color ?? this.colores[0],
    };
    this.errorGuardar = '';
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    if (this.guardando) return;
    this.modalAbierto = false;
  }

  guardar(): void {
    if (this.guardando) return;
    const nombre = this.form.nombre.trim();
    if (!nombre) { this.errorGuardar = 'El nombre es obligatorio.'; return; }

    this.guardando    = true;
    this.errorGuardar = '';

    const obs = this.editandoId
      ? this.svc.actualizarEquipo(this.editandoId, this.form)
      : this.svc.crearEquipo(this.form);

    obs.subscribe({
      next: () => {
        this.guardando    = false;
        this.modalAbierto = false;
        this.cargar();
      },
      error: err => {
        this.guardando    = false;
        this.errorGuardar = err?.error?.message ?? 'No se pudo guardar el equipo.';
      },
    });
  }

  // ── Modal eliminar ────────────────────────────────────────────────────────

  abrirModalEliminar(eq: Equipo, event: Event): void {
    event.stopPropagation();
    this.equipoAEliminar = eq;
    this.modalEliminar   = true;
  }

  cerrarModalEliminar(): void {
    if (this.eliminando) return;
    this.modalEliminar   = false;
    this.equipoAEliminar = null;
  }

  confirmarEliminar(): void {
    if (!this.equipoAEliminar || this.eliminando) return;
    this.eliminando = true;
    this.svc.eliminarEquipo(this.equipoAEliminar.id).subscribe({
      next: () => {
        if (this.equipoActivo?.id === this.equipoAEliminar!.id) this.cerrarPanel();
        this.eliminando      = false;
        this.modalEliminar   = false;
        this.equipoAEliminar = null;
        this.cargar();
      },
      error: e => {
        this.eliminando = false;
        this.toast('error', e?.error?.message ?? 'No se pudo eliminar el equipo.');
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  inicialNombre(nombre: string): string {
    return nombre?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? '?';
  }

  private formVacio() {
    return { nombre: '', descripcion: '', color: this.colores[0] };
  }

  toast(tipo: 'ok' | 'error', msg: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, tipo, msg });
    setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 4000);
  }
}
