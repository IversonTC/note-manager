import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription, interval, forkJoin, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { TareasService } from '../../../services/tareas.service';
import { ColaboradoresService, ColaboradorApi } from '../../../services/colaboradores.service';
import { Tablero, CrearTableroDto, MiembroTablero, Tarea } from '../../../interfaces/tareas';
import { RecordatoriosComponent } from '../../recordatorios/recordatorios.component';
import { CronogramaComponent } from '../../../shared/cronograma/cronograma.component';

type TabActiva = 'tableros' | 'cronograma' | 'recordatorios';

interface IconoOpcion { value: string; label: string; }
interface ColorOpcion { value: string; }

@Component({
  selector: 'app-tableros',
  standalone: true,
  imports: [CommonModule, FormsModule, RecordatoriosComponent, CronogramaComponent],
  templateUrl: './tableros.component.html',
})
export class TablerosComponent implements OnInit, OnDestroy {
  private svc      = inject(TareasService);
  private colabSvc = inject(ColaboradoresService);
  private router   = inject(Router);

  // ── Tab ───────────────────────────────────────────────────────────────────
  tabActiva: TabActiva = 'tableros';

  // ── Catálogos UI ──────────────────────────────────────────────────────────
  readonly iconos: IconoOpcion[] = [
    { value: 'fa-solid fa-clipboard-list', label: 'Tablero'   },
    { value: 'fa-solid fa-rocket',         label: 'Proyecto'  },
    { value: 'fa-solid fa-bullseye',       label: 'Objetivos' },
    { value: 'fa-solid fa-bug',            label: 'Bugs'      },
    { value: 'fa-solid fa-lightbulb',      label: 'Ideas'     },
    { value: 'fa-solid fa-people-group',   label: 'Equipo'    },
    { value: 'fa-solid fa-calendar-check', label: 'Sprint'    },
    { value: 'fa-solid fa-flag',           label: 'Hitos'     },
  ];

  readonly colores: ColorOpcion[] = [
    { value: '#3b82f6' }, { value: '#22c55e' }, { value: '#f59e0b' },
    { value: '#ef4444' }, { value: '#8b5cf6' }, { value: '#ec4899' },
    { value: '#14b8a6' }, { value: '#6366f1' },
  ];

  // ── Datos ─────────────────────────────────────────────────────────────────
  tableros: Tablero[] = [];
  cargando = false;
  buscar   = '';

  // ── Modal crear/editar ────────────────────────────────────────────────────
  modalAbierto   = false;
  guardando      = false;
  errorGuardar   = '';
  editandoId: number | null = null;
  form: CrearTableroDto = this.formularioVacio();

  // ── Gestión de miembros (dentro del modal) ────────────────────────────────
  /** Miembros seleccionados para el form (al crear o editar). */
  miembrosForm: MiembroTablero[]       = [];
  cargandoMiembrosForm                  = false;
  buscarMiembroTexto                    = '';
  miembrosSugeridos: ColaboradorApi[]   = [];
  buscandoMiembro                       = false;
  private buscarMiembro$ = new Subject<string>();

  // ── Panel lateral: gestionar miembros de un tablero existente ────────────
  panelMiembros: Tablero | null        = null;
  miembrosPanel: MiembroTablero[]      = [];
  cargandoPanel                         = false;
  buscarMiembroPanelTexto               = '';
  miembrosPanelSugeridos: ColaboradorApi[] = [];
  buscandoMiembroPanel                  = false;
  private buscarMiembroPanel$ = new Subject<string>();

  // ── Modal confirmar eliminar ──────────────────────────────────────────────
  modalEliminar      = false;
  eliminandoTablero: Tablero | null = null;
  eliminando         = false;

  // ── Cronograma (calendario de vencimientos, entre todos los tableros) ─────
  cronogramaCargado      = false;
  cargandoCronograma     = false;
  tareasCronograma: Tarea[] = [];

  // ── Toasts ────────────────────────────────────────────────────────────────
  toasts: { id: number; tipo: 'ok' | 'error'; msg: string }[] = [];
  private toastId = 0;

  private subs = new Subscription();

  // ── Usuario ───────────────────────────────────────────────────────────────
  private readonly codigoUsuario: string;

  constructor() {
    this.codigoUsuario = this.parseUsuario().codigo ?? '';
  }

  private parseUsuario(): any {
    try { return JSON.parse(sessionStorage.getItem('usuario') ?? '{}'); } catch { return {}; }
  }

  // ─────────────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.cargar();

    // Debounce búsqueda en el modal
    this.subs.add(
      this.buscarMiembro$.pipe(
        debounceTime(300), distinctUntilChanged(),
        switchMap(q => { this.buscandoMiembro = true; return this.colabSvc.getAliados({ buscar: q, porPagina: 10, estado: 1 }); }),
      ).subscribe({
        next: r => { this.miembrosSugeridos = r.items; this.buscandoMiembro = false; },
        error: ()  => { this.buscandoMiembro = false; },
      })
    );

    // Debounce búsqueda en el panel lateral
    this.subs.add(
      this.buscarMiembroPanel$.pipe(
        debounceTime(300), distinctUntilChanged(),
        switchMap(q => { this.buscandoMiembroPanel = true; return this.colabSvc.getAliados({ buscar: q, porPagina: 10, estado: 1 }); }),
      ).subscribe({
        next: r => { this.miembrosPanelSugeridos = r.items; this.buscandoMiembroPanel = false; },
        error: ()  => { this.buscandoMiembroPanel = false; },
      })
    );

    // Polling cada 2s para simular tiempo real, sin recargar la página.
    // Se omite mientras haya un modal/panel abierto para no interrumpir al usuario.
    this.subs.add(
      interval(2000).pipe(
        switchMap(() => this.svc.listarTableros(this.codigoUsuario)),
      ).subscribe({
        next: data => {
          if (this.modalAbierto || this.panelMiembros || this.modalEliminar) return;
          this.tableros = data ?? [];
        },
        error: () => {},
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.buscarMiembro$.complete();
    this.buscarMiembroPanel$.complete();
  }


  // ── Carga ─────────────────────────────────────────────────────────────────

  cargar(): void {
    this.cargando = true;
    this.svc.listarTableros(this.codigoUsuario).subscribe({
      next: data => { this.tableros = data ?? []; this.cargando = false; },
      error: ()   => { this.cargando = false; },
    });
  }

  cambiarTab(tab: TabActiva): void {
    this.tabActiva = tab;
    if (tab === 'cronograma' && !this.cronogramaCargado) {
      this.cronogramaCargado = true;
      this.cargarCronograma();
    }
  }

  // ── Cronograma ───────────────────────────────────────────────────────────

  /**
   * `listarTareas({})` sin `tablero_id` no devolvía nada de forma confiable
   * (el backend parece requerir el filtro por tablero) — en vez de depender
   * de eso, se agregan las tareas tablero por tablero con `listarTareas({tablero_id})`,
   * el mismo filtro que ya usa cada Kanban individual y que sí funciona.
   */
  cargarCronograma(): void {
    this.cargandoCronograma = true;

    const traerTableros$ = this.tableros.length > 0
      ? of(this.tableros)
      : this.svc.listarTableros(this.codigoUsuario);

    traerTableros$.subscribe({
      next: tableros => {
        this.tableros = tableros ?? [];
        if (this.tableros.length === 0) {
          this.tareasCronograma   = [];
          this.cargandoCronograma = false;
          return;
        }
        forkJoin(this.tableros.map(t => this.svc.listarTareas({ tablero_id: t.id }))).subscribe({
          next: listas => {
            this.tareasCronograma   = listas.flat();
            this.cargandoCronograma = false;
          },
          error: () => { this.cargandoCronograma = false; },
        });
      },
      error: () => { this.cargandoCronograma = false; },
    });
  }

  /** El calendario general emite el tablero de la tarea clickeada — navega a su Kanban. */
  irAlTableroDesdeCronograma(tableroId: number): void {
    this.router.navigate(['/layout/tareas-kanban', tableroId]);
  }

  get tablerosFiltrados(): Tablero[] {
    const q = this.buscar.trim().toLowerCase();
    if (!q) return this.tableros;
    return this.tableros.filter(t =>
      t.nombre.toLowerCase().includes(q) ||
      (t.descripcion ?? '').toLowerCase().includes(q)
    );
  }

  // ── Navegación ────────────────────────────────────────────────────────────

  abrirTablero(t: Tablero): void {
    this.router.navigate(['/layout/tareas-kanban', t.id]);
  }

  // ── Modal crear/editar ────────────────────────────────────────────────────

  abrirModalCrear(): void {
    this.editandoId           = null;
    this.form                 = this.formularioVacio();
    this.miembrosForm         = [];
    this.buscarMiembroTexto   = '';
    this.miembrosSugeridos    = [];
    this.errorGuardar         = '';
    this.modalAbierto         = true;
  }

  abrirModalEditar(t: Tablero, event: Event): void {
    event.stopPropagation();
    this.editandoId = t.id;
    this.form = {
      nombre:      t.nombre,
      descripcion: t.descripcion ?? '',
      color:       t.color ?? this.colores[0].value,
      icono:       t.icono ?? this.iconos[0].value,
      visibilidad: t.visibilidad ?? 'privado',
    };
    this.miembrosForm         = [];
    this.buscarMiembroTexto   = '';
    this.miembrosSugeridos    = [];
    this.errorGuardar         = '';

    // Si es equipo, cargar miembros actuales del tablero
    if (t.visibilidad === 'equipo') {
      this.cargandoMiembrosForm = true;
      this.svc.listarMiembrosTablero(t.id).subscribe({
        next: m => { this.miembrosForm = m ?? []; this.cargandoMiembrosForm = false; },
        error: ()  => { this.cargandoMiembrosForm = false; },
      });
    }

    this.modalAbierto = true;
  }

  onVisibilidadChange(): void {
    if (this.form.visibilidad !== 'equipo') {
      this.miembrosForm       = [];
      this.buscarMiembroTexto = '';
      this.miembrosSugeridos  = [];
    }
  }

  cerrarModal(): void {
    if (this.guardando) return;
    this.modalAbierto = false;
  }

  guardar(): void {
    if (this.guardando) return;
    const nombre = this.form.nombre?.trim();
    if (!nombre) { this.errorGuardar = 'El nombre es obligatorio.'; return; }

    this.guardando    = true;
    this.errorGuardar = '';

    if (this.editandoId) {
      // ── Editar: guardar detalles. Los miembros ya se gestionaron en tiempo real.
      this.svc.actualizarTablero(this.editandoId, this.form).subscribe({
        next: () => { this.guardando = false; this.modalAbierto = false; this.cargar(); },
        error: err => { this.guardando = false; this.errorGuardar = err?.error?.message ?? 'No se pudo guardar.'; },
      });
    } else {
      // ── Crear: crear tablero y luego agregar miembros uno a uno
      const dto: CrearTableroDto = {
        ...this.form,
        miembros_iniciales: this.miembrosForm.length > 0
          ? this.miembrosForm.map(m => m.codigo)
          : undefined,
      };
      this.svc.crearTablero(dto).subscribe({
        next: tableroCreado => {
          // Agregar miembros secuencialmente si el backend no los procesa en el DTO
          const pendientes = [...this.miembrosForm];
          const agregarSiguiente = () => {
            const m = pendientes.shift();
            if (!m) { this.guardando = false; this.modalAbierto = false; this.cargar(); return; }
            this.svc.agregarMiembroTablero(tableroCreado.id, { codigo: m.codigo, rol: 'editor' })
              .subscribe({ next: agregarSiguiente, error: agregarSiguiente });
          };
          agregarSiguiente();
        },
        error: err => { this.guardando = false; this.errorGuardar = err?.error?.message ?? 'No se pudo crear el tablero.'; },
      });
    }
  }

  // ── Miembros en el modal (crear y editar) ─────────────────────────────────

  onBuscarMiembro(q: string): void {
    this.buscarMiembroTexto = q;
    this.miembrosSugeridos  = [];
    if (q.trim().length >= 2) this.buscarMiembro$.next(q.trim());
  }

  yaMiembroForm(codigo: string): boolean {
    return this.miembrosForm.some(m => m.codigo === codigo);
  }

  agregarMiembroForm(colab: ColaboradorApi): void {
    if (this.yaMiembroForm(colab.codigo)) return;

    if (this.editandoId) {
      // En edición: llamada inmediata a la API. La respuesta del backend no
      // siempre trae nombre/empresa — se completan con los datos del
      // colaborador ya conocidos (de la búsqueda) para que se vean de una vez,
      // sin tener que cerrar y volver a entrar al tablero.
      this.svc.agregarMiembroTablero(this.editandoId, { codigo: colab.codigo, rol: 'editor' }).subscribe({
        next: m => {
          this.miembrosForm = [...this.miembrosForm, {
            ...m,
            nombre:  m.nombre  || colab.nombre,
            empresa: m.empresa || colab.empresa,
          }];
          this.buscarMiembroTexto = '';
          this.miembrosSugeridos  = [];
        },
        error: e => this.toast('error', e?.error?.message ?? 'No se pudo agregar el miembro.'),
      });
    } else {
      // En creación: solo acumular en lista local
      this.miembrosForm = [...this.miembrosForm, { codigo: colab.codigo, nombre: colab.nombre, empresa: colab.empresa, rol: 'editor' }];
      this.buscarMiembroTexto = '';
      this.miembrosSugeridos  = [];
    }
  }

  quitarMiembroForm(m: MiembroTablero): void {
    if (this.editandoId) {
      this.svc.quitarMiembroTablero(this.editandoId, m.codigo).subscribe({
        next: () => { this.miembrosForm = this.miembrosForm.filter(x => x.codigo !== m.codigo); },
        error: e => this.toast('error', e?.error?.message ?? 'No se pudo quitar el miembro.'),
      });
    } else {
      this.miembrosForm = this.miembrosForm.filter(x => x.codigo !== m.codigo);
    }
  }

  // ── Panel lateral: miembros de tablero ya creado ──────────────────────────

  abrirPanelMiembros(t: Tablero, event: Event): void {
    event.stopPropagation();
    this.panelMiembros            = t;
    this.miembrosPanel            = [];
    this.buscarMiembroPanelTexto  = '';
    this.miembrosPanelSugeridos   = [];
    this.cargandoPanel            = true;

    this.svc.listarMiembrosTablero(t.id).subscribe({
      next: m => { this.miembrosPanel = m ?? []; this.cargandoPanel = false; },
      error: ()  => { this.cargandoPanel = false; },
    });
  }

  cerrarPanel(): void {
    this.panelMiembros           = null;
    this.miembrosPanel           = [];
    this.buscarMiembroPanelTexto = '';
    this.miembrosPanelSugeridos  = [];
  }

  onBuscarMiembroPanel(q: string): void {
    this.buscarMiembroPanelTexto = q;
    this.miembrosPanelSugeridos  = [];
    if (q.trim().length >= 2) this.buscarMiembroPanel$.next(q.trim());
  }

  yaMiembroPanel(codigo: string): boolean {
    return this.miembrosPanel.some(m => m.codigo === codigo);
  }

  agregarMiembroPanel(colab: ColaboradorApi): void {
    if (!this.panelMiembros || this.yaMiembroPanel(colab.codigo)) return;
    this.svc.agregarMiembroTablero(this.panelMiembros.id, { codigo: colab.codigo, rol: 'editor' }).subscribe({
      next: m => {
        // La respuesta del backend no siempre trae nombre/empresa — se
        // completan con los datos ya conocidos del colaborador.
        this.miembrosPanel = [...this.miembrosPanel, {
          ...m,
          nombre:  m.nombre  || colab.nombre,
          empresa: m.empresa || colab.empresa,
        }];
        this.buscarMiembroPanelTexto = '';
        this.miembrosPanelSugeridos  = [];
        this.toast('ok', `${colab.nombre} agregado.`);
        this.actualizarContadorMiembros(this.panelMiembros!.id, +1);
      },
      error: e => this.toast('error', e?.error?.message ?? 'No se pudo agregar el miembro.'),
    });
  }

  quitarMiembroPanel(m: MiembroTablero): void {
    if (!this.panelMiembros) return;
    this.svc.quitarMiembroTablero(this.panelMiembros.id, m.codigo).subscribe({
      next: () => {
        this.miembrosPanel = this.miembrosPanel.filter(x => x.codigo !== m.codigo);
        this.toast('ok', `${m.nombre} eliminado.`);
        this.actualizarContadorMiembros(this.panelMiembros!.id, -1);
      },
      error: e => this.toast('error', e?.error?.message ?? 'No se pudo quitar el miembro.'),
    });
  }

  private actualizarContadorMiembros(tableroId: number, delta: number): void {
    this.tableros = this.tableros.map(t =>
      t.id === tableroId
        ? { ...t, total_miembros: Math.max(0, (t.total_miembros ?? 0) + delta) }
        : t
    );
    if (this.panelMiembros?.id === tableroId) {
      this.panelMiembros = { ...this.panelMiembros, total_miembros: Math.max(0, (this.panelMiembros.total_miembros ?? 0) + delta) };
    }
  }

  // ── Modal eliminar ────────────────────────────────────────────────────────

  abrirModalEliminar(t: Tablero, event: Event): void {
    event.stopPropagation();
    this.eliminandoTablero = t;
    this.modalEliminar     = true;
  }

  cerrarModalEliminar(): void {
    if (this.eliminando) return;
    this.modalEliminar     = false;
    this.eliminandoTablero = null;
  }

  confirmarEliminar(): void {
    if (!this.eliminandoTablero || this.eliminando) return;
    this.eliminando = true;
    this.svc.eliminarTablero(this.eliminandoTablero.id).subscribe({
      next: () => {
        if (this.panelMiembros?.id === this.eliminandoTablero!.id) this.cerrarPanel();
        this.eliminando        = false;
        this.modalEliminar     = false;
        this.eliminandoTablero = null;
        this.cargar();
      },
      error: () => { this.eliminando = false; },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  inicialNombre(nombre: string): string {
    return nombre?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() ?? '?';
  }

  toast(tipo: 'ok' | 'error', msg: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, tipo, msg });
    setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 4000);
  }

  private formularioVacio(): CrearTableroDto {
    return {
      nombre:      '',
      descripcion: '',
      color:       this.colores[0].value,
      icono:       this.iconos[0].value,
      visibilidad: 'privado',
    };
  }
}
