import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  NgZone,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

type LogType = 'log' | 'warn' | 'error' | 'info';
interface LogEntry {
  id: number;
  type: LogType;
  msg: string;
  time: string;
}
interface ErrorEntry {
  id: number;
  type: string;
  msg: string;
  time: string;
}
interface StorageEntry {
  key: string;
  value: string;
  raw: string;
  source: 'session' | 'local';
}
interface NetworkEntry {
  id: number;
  method: string;
  url: string;
  status?: number;
  duration?: number;
  requestBody?: any;
  response?: string;
  ok?: boolean;
  time: string;
  expanded: boolean;
  prettyResponse?: string;
}

@Component({
  selector: 'app-dev-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="visible"
      class="fixed z-[99999] flex flex-col rounded-2xl shadow-2xl overflow-hidden select-none"
      [style.left.px]="panelX"
      [style.top.px]="panelY"
      style="
    width:540px;
    max-height:82vh;
    background:#0f172aee;
    backdrop-filter: blur(18px);
    border:1px solid rgba(255,255,255,0.08);
    font-family:monospace;
    font-size:11px;
    resize: both;
  "
    >
      <!-- ── Header ── -->
      <div
        class="flex items-center justify-between px-3 py-2 flex-shrink-0 cursor-move"
        style="background:#1e293b;border-bottom:1px solid rgba(255,255,255,0.08)"
        (mousedown)="startDrag($event)"
      >
        <span class="font-bold" style="color:#60a5fa">
          <i class="fa-solid fa-bug mr-1.5"></i>DEV PANEL
        </span>
        <div class="flex items-center gap-2">
          <button
            (click)="refreshStorage()"
            style="color:#64748b"
            class="hover:text-white transition"
            title="Refrescar storage"
          >
            <i class="fa-solid fa-rotate-right text-[10px]"></i>
          </button>
          <button
            (click)="visible = false"
            style="color:#64748b"
            class="hover:text-white transition"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- ── Tabs ── -->
      <div
        class="flex flex-shrink-0 overflow-x-auto"
        style="background:#1e293b;border-bottom:1px solid rgba(255,255,255,0.06)"
      >
        <button
          *ngFor="let t of tabs"
          (click)="tab = t.id"
          class="px-3 py-1.5 transition-all flex-shrink-0 relative whitespace-nowrap"
          [style.color]="tab === t.id ? '#60a5fa' : '#64748b'"
          [style.border-bottom]="
            tab === t.id ? '2px solid #60a5fa' : '2px solid transparent'
          "
        >
          <i [class]="t.icon + ' mr-1'"></i>{{ t.label }}
          <span
            *ngIf="t.id === 'errors' && errorCount > 0"
            class="ml-1 px-1 rounded-full text-[9px]"
            style="background:#ef4444;color:#fff"
            >{{ errorCount }}</span
          >
          <span
            *ngIf="t.id === 'console' && logs.length > 0"
            class="ml-1 px-1 rounded-full text-[9px]"
            style="background:rgba(96,165,250,0.2);color:#60a5fa"
            >{{ logs.length }}</span
          >
          <span
            *ngIf="t.id === 'network' && network.length > 0"
            class="ml-1 px-1 rounded-full text-[9px]"
            style="background:rgba(251,191,36,0.2);color:#fbbf24"
            >{{ network.length }}</span
          >
        </button>
      </div>

      <!-- ══════════════ TAB: STORAGE ══════════════ -->
      <div
        *ngIf="tab === 'storage'"
        class="flex-1 min-h-0 overflow-y-auto px-3 py-2 flex flex-col gap-1.5"
        style="scrollbar-width:thin;scrollbar-color:#334155 transparent"
      >
        <div
          *ngIf="storageEntries.length === 0"
          class="py-4 text-center"
          style="color:#475569"
        >
          Storage vacío
        </div>
        <div
          *ngFor="let e of storageEntries; trackBy: trackByStorage"
          class="rounded-lg overflow-hidden flex-shrink-0"
          style="border:1px solid rgba(255,255,255,0.06)"
        >
          <!-- Cabecera clicable -->
          <div
            class="flex items-center justify-between px-2 py-1.5 cursor-pointer transition hover:bg-white/5"
            style="background:#1e293b"
            (click)="toggleStorage(e.key)"
          >
            <div class="flex items-center gap-2 min-w-0">
              <i class="fa-solid text-[9px] flex-shrink-0"
                 [class.fa-chevron-right]="!expandedStorage.has(e.key)"
                 [class.fa-chevron-down]="expandedStorage.has(e.key)"
                 style="color:#475569"></i>
              <span class="font-bold truncate" style="color:#e2e8f0">{{ e.key }}</span>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span
                class="text-[9px] truncate"
                style="color:#475569;max-width:120px"
                *ngIf="!expandedStorage.has(e.key)"
              >{{ e.raw | slice:0:40 }}{{ e.raw.length > 40 ? '…' : '' }}</span>
              <span
                class="text-[9px] px-1.5 py-0.5 rounded-full"
                [style.background]="e.source === 'session' ? 'rgba(52,211,153,0.12)' : 'rgba(167,139,250,0.12)'"
                [style.color]="e.source === 'session' ? '#34d399' : '#a78bfa'"
              >{{ e.source }}</span>
              <button
                (click)="$event.stopPropagation(); copiarTexto(e.value, 'st-' + e.key)"
                class="text-[9px] px-1.5 py-0.5 rounded transition-all duration-200"
                [style.background]="copyState === 'st-' + e.key ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'"
                [style.color]="copyState === 'st-' + e.key ? '#34d399' : '#64748b'"
                title="Copiar valor"
              >
                <i class="fa-solid"
                   [class.fa-copy]="copyState !== 'st-' + e.key"
                   [class.fa-check]="copyState === 'st-' + e.key"></i>
              </button>
            </div>
          </div>
          <!-- Valor expandido -->
          <div
            *ngIf="expandedStorage.has(e.key)"
            class="px-2 py-1.5 break-all leading-relaxed whitespace-pre-wrap overflow-y-auto"
            style="color:#94a3b8;max-height:200px;scrollbar-width:thin;scrollbar-color:#334155 transparent"
          >{{ e.value }}</div>
        </div>
        <button
          (click)="limpiarSesion()"
          class="mt-1 py-1.5 rounded-lg text-center transition-all hover:opacity-80"
          style="background:rgba(239,68,68,0.12);color:#f87171;border:1px solid rgba(239,68,68,0.2)"
        >
          <i class="fa-solid fa-trash-can mr-1"></i>Limpiar sesión
        </button>
      </div>

      <!-- ══════════════ TAB: CONSOLE ══════════════ -->
      <div
        *ngIf="tab === 'console'"
        class="flex-1 flex flex-col overflow-hidden"
      >
        <div class="flex-1 min-h-0 overflow-y-auto px-2 py-1.5 flex flex-col gap-0.5"
             style="scrollbar-width:thin;scrollbar-color:#334155 transparent">
          <div
            *ngIf="logs.length === 0"
            class="py-4 text-center"
            style="color:#475569"
          >
            Sin logs aún.
          </div>
          <div
            *ngFor="let l of logs; trackBy: trackByLog"
            class="group rounded-md leading-relaxed transition-all duration-150"
            style="border:1px solid transparent"
            [style.border-color]="expandedLog.has(l.id) ? 'rgba(255,255,255,0.06)' : 'transparent'"
          >
            <!-- Fila resumen — clicable -->
            <div
              class="flex gap-2 px-2 py-1 cursor-pointer hover:bg-white/5 rounded-md"
              (click)="toggleLog(l.id)"
            >
              <span class="flex-shrink-0" [style.color]="logColor(l.type)">{{ logIcon(l.type) }}</span>
              <span
                class="flex-1 break-all"
                [class.whitespace-nowrap]="!expandedLog.has(l.id)"
                [class.overflow-hidden]="!expandedLog.has(l.id)"
                [class.text-ellipsis]="!expandedLog.has(l.id)"
                [class.whitespace-pre-wrap]="expandedLog.has(l.id)"
                [style.color]="logColor(l.type)"
              >{{ expandedLog.has(l.id) ? l.msg : (l.msg | slice:0:80) + (l.msg.length > 80 ? '…' : '') }}</span>
              <div class="flex items-center gap-2 flex-shrink-0">
                <button
                  (click)="$event.stopPropagation(); copiarTexto(l.msg, 'log-' + l.id)"
                  class="opacity-0 group-hover:opacity-100 transition-all text-[9px] px-1.5 py-0.5 rounded"
                  [style.background]="copyState === 'log-' + l.id ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'"
                  [style.color]="copyState === 'log-' + l.id ? '#34d399' : '#94a3b8'"
                >
                  <i class="fa-solid"
                     [class.fa-copy]="copyState !== 'log-' + l.id"
                     [class.fa-check]="copyState === 'log-' + l.id"></i>
                </button>
                <span class="text-[9px]" style="color:#475569">{{ l.time }}</span>
                <i class="fa-solid text-[9px] opacity-0 group-hover:opacity-60"
                   style="color:#94a3b8"
                   [class.fa-chevron-down]="!expandedLog.has(l.id)"
                   [class.fa-chevron-up]="expandedLog.has(l.id)"></i>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex-shrink-0 px-2 pb-2 pt-1.5"
          style="border-top:1px solid rgba(255,255,255,0.06)"
        >
          <div
            *ngIf="evalResult"
            class="mb-1.5 px-2 py-1.5 rounded-lg break-all whitespace-pre-wrap"
            [style.color]="evalError ? '#f87171' : '#34d399'"
            style="background:#1e293b;max-height:80px;overflow-y:auto"
          >
            {{ evalResult }}
          </div>
          <div class="flex gap-1.5">
            <input
              [(ngModel)]="evalInput"
              (keydown.enter)="runEval()"
              (keydown.ArrowUp)="historialUp($event)"
              placeholder="js expression... (Enter)"
              class="flex-1 px-2 py-1.5 rounded-lg outline-none text-[11px]"
              style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.1)"
            />
            <button
              (click)="runEval()"
              class="px-3 py-1.5 rounded-lg transition hover:opacity-80"
              style="background:rgba(96,165,250,0.15);color:#60a5fa;border:1px solid rgba(96,165,250,0.2)"
            >
              <i class="fa-solid fa-play text-[9px]"></i>
            </button>
            <button
              (click)="limpiarLogs()"
              class="px-2 py-1.5 rounded-lg transition hover:opacity-80"
              style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.15)"
              title="Limpiar"
            >
              <i class="fa-solid fa-trash-can text-[9px]"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- ══════════════ TAB: NETWORK ══════════════ -->
      <div
        *ngIf="tab === 'network'"
        class="flex-1 flex flex-col overflow-hidden"
      >
        <!-- Filtros -->
        <div
          class="flex items-center gap-1.5 px-2 py-1.5 flex-shrink-0"
          style="border-bottom:1px solid rgba(255,255,255,0.06)"
        >
          <button
            *ngFor="let m of netMethods"
            (click)="netFilter = m"
            class="text-[9px] px-2 py-0.5 rounded-full transition"
            [style.background]="
              netFilter === m
                ? 'rgba(96,165,250,0.25)'
                : 'rgba(255,255,255,0.05)'
            "
            [style.color]="netFilter === m ? '#60a5fa' : '#64748b'"
          >
            {{ m }}
          </button>
          <input
            [(ngModel)]="netSearch"
            placeholder="filtrar URL..."
            class="flex-1 px-2 py-0.5 rounded-lg outline-none text-[10px] ml-1"
            style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(255,255,255,0.08)"
          />
          <button
            (click)="network = []"
            title="Limpiar"
            style="color:#64748b"
            class="hover:text-red-400 transition ml-1"
          >
            <i class="fa-solid fa-trash-can text-[10px]"></i>
          </button>
        </div>

        <!-- Lista -->
        <div class="flex-1 min-h-0 overflow-y-auto px-2 py-1.5 flex flex-col gap-1">
          <div
            *ngIf="filteredNetwork.length === 0"
            class="py-4 text-center"
            style="color:#475569"
          >
            Sin requests aún
          </div>

          <div
            *ngFor="let n of filteredNetwork; trackBy: trackByNetwork"
            class="rounded-lg overflow-hidden cursor-pointer"
            style="border:1px solid rgba(255,255,255,0.06)"
            (click)="n.expanded = !n.expanded"
          >
            <!-- Row principal -->
            <div
              class="flex items-center gap-2 px-2 py-1.5"
              style="background:#1e293b"
            >
              <!-- Método -->
              <span
                class="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                [style.background]="methodBg(n.method)"
                [style.color]="methodColor(n.method)"
                >{{ n.method }}</span
              >
              <!-- Status -->
              <span
                class="text-[10px] font-bold flex-shrink-0"
                [style.color]="statusColor(n.status)"
              >
                {{ n.status ?? 'ERR' }}
              </span>
              <!-- URL -->
              <span class="flex-1 truncate" style="color:#cbd5e1">{{
                n.url
              }}</span>
              <!-- Duración + hora -->
              <span class="flex-shrink-0 text-[9px]" style="color:#475569"
                >{{ n.duration }}ms</span
              >
              <span class="flex-shrink-0 text-[9px]" style="color:#334155">{{
                n.time
              }}</span>
              <i
                class="fa-solid flex-shrink-0 text-[9px]"
                style="color:#475569"
                [class.fa-chevron-down]="!n.expanded"
                [class.fa-chevron-up]="n.expanded"
              ></i>
            </div>

            <!-- Detalle expandido -->
            <div
              *ngIf="n.expanded"
              class="px-2 py-2 flex flex-col gap-1.5"
              style="background:#0d1424"
            >
              <!-- Request body -->
              <div *ngIf="n.requestBody">
                <p class="text-[9px] mb-0.5" style="color:#60a5fa">
                  REQUEST BODY
                </p>
                <div
                  class="px-2 py-1 rounded break-all whitespace-pre-wrap"
                  style="background:#1e293b;color:#94a3b8;max-height:100px;overflow-y:auto"
                >
                  {{ n.requestBody }}
                </div>
              </div>

              <!-- Response -->
              <div>
                <div class="flex items-center justify-between mb-0.5">
                  <p class="text-[9px]" style="color:#34d399">RESPONSE</p>
                  <button
                    (click)="
                      $event.stopPropagation();
                      copiarTexto(n.prettyResponse || n.response, 'net-' + n.id)
                    "
                    class="text-[9px] px-1.5 py-0.5 rounded transition-all duration-200 hover:scale-105"
                    [style.background]="
                      copyState === 'net-' + n.id
                        ? 'rgba(52,211,153,0.2)'
                        : 'rgba(52,211,153,0.1)'
                    "
                    [style.color]="copiedId === n.id ? '#6ee7b7' : '#34d399'"
                  >
                    <i
                      class="fa-solid mr-0.5"
                      [class.fa-copy]="copiedId !== n.id"
                      [class.fa-check]="copiedId === n.id"
                    >
                    </i>

                    {{ copiedId === n.id ? 'copiado' : 'copiar' }}
                  </button>
                </div>
                <div
                  class="px-2 py-1 rounded break-all whitespace-pre-wrap"
                  style="background:#1e293b;color:#94a3b8;max-height:140px;overflow-y:auto"
                >
                  {{ n.prettyResponse || n.response || '(vacío)' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════ TAB: ERRORES ══════════════ -->
      <div
        *ngIf="tab === 'errors'"
        class="flex-1 min-h-0 overflow-y-auto px-2 py-1.5 flex flex-col gap-1"
      >
        <div
          *ngIf="errors.length === 0"
          class="py-4 text-center"
          style="color:#475569"
        >
          <i class="fa-solid fa-circle-check mr-1" style="color:#34d399"></i>Sin
          errores registrados
        </div>
        <div
          *ngFor="let e of errors; trackBy: trackByError"
          class="px-2 py-1.5 rounded-lg break-all leading-relaxed"
          style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171"
        >
          <div class="flex justify-between mb-0.5">
            <span class="font-bold text-[9px]" style="color:#ef4444">{{
              e.type
            }}</span>
            <span class="text-[9px]" style="color:#475569">{{ e.time }}</span>
          </div>
          <span style="color:#fca5a5">{{ e.msg }}</span>
        </div>
        <button
          *ngIf="errors.length"
          (click)="errors = []; errorCount = 0"
          class="mt-1 py-1.5 rounded-lg text-center transition hover:opacity-80"
          style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.2)"
        >
          <i class="fa-solid fa-trash-can mr-1"></i>Limpiar errores
        </button>
      </div>

      <!-- ══════════════ TAB: USUARIO ══════════════ -->
      <div
        *ngIf="tab === 'usuario'"
        class="flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-3"
        style="scrollbar-width:thin;scrollbar-color:#334155 transparent"
      >
        <!-- Campos rápidos (acordeón) -->
        <div class="rounded-lg overflow-hidden flex-shrink-0" style="border:1px solid rgba(167,139,250,0.18)">
          <div class="flex items-center justify-between px-2 py-1.5 cursor-pointer transition hover:bg-white/5"
               style="background:#1e293b"
               (click)="toggleAcc('campos')">
            <span class="text-[9px] font-bold tracking-wider flex items-center gap-1.5" style="color:#a78bfa">
              <i class="fa-solid text-[9px]"
                 [class.fa-chevron-right]="!isAcc('campos')"
                 [class.fa-chevron-down]="isAcc('campos')"></i>
              CAMPOS DEL USUARIO
            </span>
            <span class="text-[9px]" style="color:#475569">{{ camposUsuario.length }} campos</span>
          </div>
          <div *ngIf="isAcc('campos')"
               class="px-2 py-2 overflow-y-auto"
               style="max-height:240px;scrollbar-width:thin;scrollbar-color:#334155 transparent">
            <div *ngIf="camposUsuario.length === 0" class="py-3 text-center text-[10px]" style="color:#475569">
              Sin datos de usuario en el storage.
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <div *ngFor="let f of camposUsuario" class="flex flex-col gap-0.5">
                <label class="text-[9px] truncate" style="color:#64748b" [title]="f.key">{{ f.key }}</label>
                <input
                  [value]="f.value"
                  (change)="editarCampoUsuario(f.key, $any($event.target).value)"
                  class="px-2 py-1 rounded-lg outline-none text-[10px]"
                  style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(167,139,250,0.25)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Editor JSON completo (acordeón) -->
        <div class="rounded-lg overflow-hidden flex-shrink-0" style="border:1px solid rgba(167,139,250,0.18)">
          <div class="flex items-center justify-between px-2 py-1.5 cursor-pointer transition hover:bg-white/5"
               style="background:#1e293b"
               (click)="toggleAcc('json')">
            <span class="text-[9px] font-bold tracking-wider flex items-center gap-1.5" style="color:#a78bfa">
              <i class="fa-solid text-[9px]"
                 [class.fa-chevron-right]="!isAcc('json')"
                 [class.fa-chevron-down]="isAcc('json')"></i>
              JSON COMPLETO
            </span>
            <button (click)="$event.stopPropagation(); cargarUsuarioJson()"
                    class="text-[9px] px-2 py-0.5 rounded transition hover:opacity-70"
                    style="background:rgba(100,116,139,0.15);color:#64748b">
              <i class="fa-solid fa-rotate-right mr-0.5"></i>recargar
            </button>
          </div>
          <div *ngIf="isAcc('json')" class="flex flex-col gap-1.5 px-2 py-2 overflow-y-auto"
               style="max-height:320px;scrollbar-width:thin;scrollbar-color:#334155 transparent">
          <textarea
            [(ngModel)]="usuarioJson"
            (ngModelChange)="validarUsuarioJson()"
            rows="10"
            spellcheck="false"
            class="w-full px-2 py-2 rounded-lg outline-none resize-y text-[10px] leading-relaxed"
            [style]="'background:#0d1424;color:#94a3b8;font-family:monospace;border:1px solid ' + (usuarioJsonError ? 'rgba(239,68,68,0.5)' : 'rgba(167,139,250,0.2)')"
          ></textarea>

          <!-- Error de parseo -->
          <div *ngIf="usuarioJsonError"
               class="px-2 py-1.5 rounded-lg text-[10px] break-all"
               style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171">
            <i class="fa-solid fa-circle-xmark mr-1"></i>{{ usuarioJsonError }}
          </div>

          <!-- OK feedback -->
          <div *ngIf="usuarioJsonOk"
               class="px-2 py-1.5 rounded-lg text-[10px]"
               style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);color:#34d399">
            <i class="fa-solid fa-circle-check mr-1"></i>Guardado en localStorage y sessionStorage
          </div>

          <!-- Acciones -->
          <div class="flex gap-1.5">
            <button (click)="guardarUsuarioJson(false)"
                    [disabled]="!!usuarioJsonError"
                    class="flex-1 py-1.5 rounded-lg font-medium transition hover:opacity-80 disabled:opacity-30 text-[11px]"
                    style="background:rgba(167,139,250,0.18);color:#a78bfa;border:1px solid rgba(167,139,250,0.3)">
              <i class="fa-solid fa-floppy-disk mr-1.5"></i>Guardar
            </button>
            <button (click)="guardarUsuarioJson(true)"
                    [disabled]="!!usuarioJsonError"
                    class="flex-1 py-1.5 rounded-lg font-medium transition hover:opacity-80 disabled:opacity-30 text-[11px]"
                    style="background:rgba(96,165,250,0.15);color:#60a5fa;border:1px solid rgba(96,165,250,0.25)">
              <i class="fa-solid fa-rotate mr-1.5"></i>Guardar y recargar
            </button>
          </div>
          </div>
        </div>

        <!-- Aviso -->
        <div class="px-3 py-2 rounded-lg text-[10px]"
             style="background:rgba(251,191,36,0.07);border:1px solid rgba(251,191,36,0.18);color:#fbbf24">
          <i class="fa-solid fa-triangle-exclamation mr-1"></i>
          Los cambios solo afectan la sesión actual del navegador.
        </div>
      </div>

      <!-- TAB: Empresa -->
      <div
        *ngIf="tab === 'empresa'"
        class="flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-3"
        style="scrollbar-width:thin;scrollbar-color:#334155 transparent"
      >
        <!-- Empresa actual -->
        <div class="space-y-1.5">
          <div class="text-[9px] font-bold tracking-wider" style="color:#60a5fa">EMPRESA ACTUAL</div>
          <div class="px-3 py-2 rounded-lg flex items-center gap-2"
               style="background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.25)">
            <i class="fa-solid fa-building text-[10px]" style="color:#60a5fa"></i>
            <span class="font-bold" style="color:#e2e8f0">{{ empresaSeleccionada }}</span>
          </div>
        </div>

        <!-- Selector + cambiar -->
        <div class="space-y-2">
          <div class="text-[9px] font-bold tracking-wider" style="color:#60a5fa">CAMBIAR EMPRESA</div>
          <select [(ngModel)]="empresaNueva"
                  class="w-full px-3 py-2 rounded-lg outline-none"
                  style="background:#1e293b;color:#e2e8f0;border:1px solid rgba(96,165,250,0.25);font-size:11px">
            <option value="">Seleccionar empresa...</option>
            <option *ngFor="let emp of empresasDisponibles" [value]="emp">{{ emp }}</option>
          </select>
          <button (click)="cambiarEmpresa()"
                  [disabled]="!empresaNueva"
                  class="w-full py-2 rounded-lg font-medium transition hover:opacity-80 disabled:opacity-30"
                  style="background:rgba(96,165,250,0.2);color:#60a5fa;border:1px solid rgba(96,165,250,0.3);font-size:11px">
            <i class="fa-solid fa-rotate mr-1.5"></i>Cambiar y recargar
          </button>
        </div>

        <!-- Aviso -->
        <div class="px-3 py-2 rounded-lg text-[10px]"
             style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);color:#fbbf24">
          <i class="fa-solid fa-triangle-exclamation mr-1"></i>
          Al cambiar empresa se limpia la caché y se recarga la página.
        </div>

        <!-- Empresas rápidas -->
        <div class="space-y-1.5">
          <div class="text-[9px] font-bold tracking-wider" style="color:#60a5fa">ACCESO RÁPIDO</div>
          <div class="grid grid-cols-2 gap-1.5">
            <button *ngFor="let emp of empresasDisponibles"
                    (click)="empresaNueva = emp; cambiarEmpresa()"
                    class="px-2 py-1.5 rounded-lg text-[10px] text-left transition hover:opacity-80"
                    [style.background]="empresaSeleccionada === emp ? 'rgba(96,165,250,0.25)' : 'rgba(96,165,250,0.08)'"
                    [style.color]="empresaSeleccionada === emp ? '#60a5fa' : '#93c5fd'"
                    [style.border]="empresaSeleccionada === emp ? '1px solid rgba(96,165,250,0.4)' : '1px solid rgba(96,165,250,0.15)'">
              <i class="fa-solid fa-building mr-1 text-[9px]"></i>{{ emp }}
              <i *ngIf="empresaSeleccionada === emp" class="fa-solid fa-check ml-1 text-[9px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DevPanelComponent implements OnInit, OnDestroy {
  visible = false;
  tab: 'storage' | 'console' | 'network' | 'errors' | 'empresa' | 'usuario' = 'storage';

  copiedId: number | null = null;

  readonly tabs = [
    { id: 'storage', label: 'Storage', icon: 'fa-solid fa-database' },
    { id: 'console', label: 'Consola', icon: 'fa-solid fa-terminal' },
    { id: 'network', label: 'Network', icon: 'fa-solid fa-globe' },
    {
      id: 'errors',
      label: 'Errores',
      icon: 'fa-solid fa-triangle-exclamation',
    },
    {
      id: 'empresa',
      label: 'Empresa',
      icon: 'fa-solid fa-building',
    },
    {
      id: 'usuario',
      label: 'Usuario',
      icon: 'fa-solid fa-user-pen',
    },
  ] as const;

  // ── Usuario editor ──
  usuarioJson        = '';
  usuarioJsonError   = '';
  usuarioJsonOk      = false;
  /**
   * Campos del usuario derivados dinámicamente de lo que haya en el storage,
   * sin claves fijas — reutilizable en cualquier sistema.
   */
  get camposUsuario(): { key: string; value: string }[] {
    try {
      const obj = JSON.parse(this.usuarioJson);
      if (!obj || typeof obj !== 'object') return [];
      return Object.keys(obj).map(k => ({
        key: k,
        value:
          obj[k] !== null && typeof obj[k] === 'object'
            ? JSON.stringify(obj[k])
            : String(obj[k] ?? ''),
      }));
    } catch {
      return [];
    }
  }

  // Acordeones del panel (claves abiertas)
  accordion = new Set<string>(['campos', 'json']);

  toggleAcc(key: string): void {
    this.accordion.has(key) ? this.accordion.delete(key) : this.accordion.add(key);
  }
  isAcc(key: string): boolean {
    return this.accordion.has(key);
  }

  // ── Empresa ──
  empresasDisponibles: string[] = ['ARRGE', 'LADCB', 'PROAG', 'HCB','INVCD','INMAT'];
  empresaSeleccionada = '';
  empresaNueva = '';

  // ── Expand states ──
  expandedStorage = new Set<string>();
  expandedLog     = new Set<number>();

  // ── State ──
  storageEntries: StorageEntry[] = [];
  logs: LogEntry[] = [];
  network: NetworkEntry[] = [];
  errors: ErrorEntry[] = [];
  errorCount = 0;
  private logSeq = 0;
  private errSeq = 0;

  // ── Console eval ──
  evalInput = '';
  evalResult = '';
  evalError = false;
  private evalHistory: string[] = [];

  // ── Network filters ──
  netFilter = 'ALL';
  netSearch = '';
  readonly netMethods = ['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  private netSeq = 0;

  // ── Konami ──
  // private readonly KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  private readonly KONAMI = ['h', 'e', 's', 'o', 'y', 'a', 'm'];
  private konamiBuffer: string[] = [];

  // ── Internals ──
  private origConsole: Partial<Record<LogType, (...a: any[]) => void>> = {};
  private origFetch!: typeof window.fetch;
  private origXhrOpen!: typeof XMLHttpRequest.prototype.open;
  private origXhrSend!: typeof XMLHttpRequest.prototype.send;
  private errorHandler!: (e: ErrorEvent) => void;
  private rejectionHandler!: (e: PromiseRejectionEvent) => void;
  private xhrListener!: EventListener;
  private intervalo: any;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  panelX = 0;
  panelY = 0;

  dragging = false;
  offsetX = 0;
  offsetY = 0;
  copyState: string | null = null;

  constructor(private zone: NgZone) {}

  // ── Konami listener ──
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    this.konamiBuffer.push(e.key);
    if (this.konamiBuffer.length > this.KONAMI.length)
      this.konamiBuffer.shift();
    if (this.konamiBuffer.join() === this.KONAMI.join()) {
      this.visible = !this.visible;
      if (this.visible) { this.refreshStorage(); this.cargarUsuarioJson(); }
      this.konamiBuffer = [];
    }
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.panelX = window.innerWidth - 540;
    this.panelY = window.innerHeight - 700;
    this.interceptConsole();
    this.interceptErrors();
    this.interceptFetch();
    this.interceptXHR();
    this.refreshStorage();
    this.cargarEmpresa();
    this.cargarUsuarioJson();
    this.intervalo = setInterval(() => {
      if (this.visible && this.tab === 'storage') this.refreshStorage();
    }, 1500);
  }

  // ── Usuario editor ──
  /** Lee el usuario priorizando sessionStorage (lo que llega del token) */
  private leerUsuarioRaw(): string {
    return sessionStorage.getItem('usuario') ?? localStorage.getItem('usuario') ?? '';
  }

  /** Persiste el usuario en ambos storages para mantenerlos en sincronía */
  private escribirUsuarioRaw(valor: string): void {
    localStorage.setItem('usuario', valor);
    sessionStorage.setItem('usuario', valor);
  }

  cargarUsuarioJson(): void {
    const raw = this.leerUsuarioRaw();
    try {
      this.usuarioJson = raw ? JSON.stringify(JSON.parse(raw), null, 2) : '{}';
    } catch {
      this.usuarioJson = raw;
    }
    this.usuarioJsonError = '';
    this.usuarioJsonOk    = false;
  }

  validarUsuarioJson(): void {
    try {
      JSON.parse(this.usuarioJson);
      this.usuarioJsonError = '';
    } catch (e: any) {
      this.usuarioJsonError = e.message;
    }
  }

  guardarUsuarioJson(reload = false): void {
    try {
      const parsed = JSON.parse(this.usuarioJson);
      this.escribirUsuarioRaw(JSON.stringify(parsed));
      this.usuarioJsonOk    = true;
      this.usuarioJsonError = '';
      this.cargarEmpresa();
      this.refreshStorage();
      setTimeout(() => (this.usuarioJsonOk = false), 2000);
      if (reload) window.location.reload();
    } catch (e: any) {
      this.usuarioJsonError = e.message;
    }
  }

  editarCampoUsuario(campo: string, valor: string): void {
    try {
      const obj = JSON.parse(this.usuarioJson);
      obj[campo] = this.coercerAlTipoOriginal(valor, obj[campo]);
      this.usuarioJson = JSON.stringify(obj, null, 2);
      this.usuarioJsonError = '';
    } catch {}
  }

  /** Conserva el tipo del valor original (number/boolean/objeto) al editar */
  private coercerAlTipoOriginal(valor: string, original: any): any {
    if (typeof original === 'number') {
      const n = Number(valor);
      return valor.trim() !== '' && !isNaN(n) ? n : valor;
    }
    if (typeof original === 'boolean') {
      return valor === 'true' ? true : valor === 'false' ? false : original;
    }
    if (original !== null && typeof original === 'object') {
      try { return JSON.parse(valor); } catch { return original; }
    }
    return valor; // string u otros tipos
  }

  cargarEmpresa(): void {
    const usuario = this.leerUsuarioRaw() || null;
    if (usuario) {
      const u = JSON.parse(usuario);
      this.empresaSeleccionada = u.empresa || 'No establecida';
    } else {
      this.empresaSeleccionada = 'No establecida';
    }
  }

  async cambiarEmpresa(): Promise<void> {
    if (!this.empresaNueva.trim()) return;
    const usuarioRaw = this.leerUsuarioRaw();
    if (!usuarioRaw) return;

    // 1. Actualizar empresa en ambos storages (sin borrar sesión)
    const u = JSON.parse(usuarioRaw);
    u.empresa = this.empresaNueva;
    this.escribirUsuarioRaw(JSON.stringify(u));
    this.empresaSeleccionada = this.empresaNueva;
    this.empresaNueva = '';

    // 2. Limpiar solo browser cache (Service Workers + Cache API) — igual que navbar
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }

    // 3. Recargar
    window.location.reload();
  }

  toggleStorage(key: string): void {
    if (this.expandedStorage.has(key)) this.expandedStorage.delete(key);
    else this.expandedStorage.add(key);
  }

  toggleLog(i: number): void {
    if (this.expandedLog.has(i)) this.expandedLog.delete(i);
    else this.expandedLog.add(i);
  }

  // trackBy por id estable — evita que Angular recree las filas (y resetee el
  // scroll) cuando llegan nuevas entradas por unshift() y todos los índices se corren.
  trackByStorage(_: number, e: StorageEntry): string { return e.source + ':' + e.key; }
  trackByLog(_: number, l: LogEntry): number { return l.id; }
  trackByNetwork(_: number, n: NetworkEntry): number { return n.id; }
  trackByError(_: number, e: ErrorEntry): number { return e.id; }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    clearInterval(this.intervalo);
    this.restoreConsole();
    if (this.origFetch) window.fetch = this.origFetch;
    if (this.origXhrOpen) XMLHttpRequest.prototype.open = this.origXhrOpen;
    if (this.origXhrSend) XMLHttpRequest.prototype.send = this.origXhrSend;
    window.removeEventListener('error', this.errorHandler);
    window.removeEventListener(
      'unhandledrejection',
      this.rejectionHandler as any,
    );
    window.removeEventListener('__dev_xhr__', this.xhrListener);
  }

  // ── Storage ──
  refreshStorage(): void {
    const entries: StorageEntry[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)!;
      const raw = sessionStorage.getItem(key) ?? '';
      entries.push({
        key,
        raw,
        value: this.prettyValue(raw),
        source: 'session',
      });
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      const raw = localStorage.getItem(key) ?? '';
      entries.push({ key, raw, value: this.prettyValue(raw), source: 'local' });
    }
    this.storageEntries = entries;
  }

  private prettyValue(raw: string): string {
    try {
      return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
      return raw;
    }
  }

  startDrag(event: MouseEvent): void {
    this.dragging = true;

    this.offsetX = event.clientX - this.panelX;
    this.offsetY = event.clientY - this.panelY;

    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
  }

  onDrag = (event: MouseEvent): void => {
    if (!this.dragging) return;

    this.panelX = event.clientX - this.offsetX;
    this.panelY = event.clientY - this.offsetY;
  };

  stopDrag = (): void => {
    this.dragging = false;

    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  };

  limpiarSesion(): void {
    sessionStorage.clear();
    this.refreshStorage();
  }

  // ── Console ──
  private interceptConsole(): void {
    (['log', 'warn', 'error', 'info'] as LogType[]).forEach((method) => {
      this.origConsole[method] = (console[method] as any).bind(console);
      (console as any)[method] = (...args: any[]) => {
        this.origConsole[method]!(...args);
        const msg = args
          .map((a) => {
            if (a instanceof Error) return `${a.name}: ${a.message}`;
            try {
              return typeof a === 'object'
                ? JSON.stringify(a, null, 2)
                : String(a);
            } catch {
              return String(a);
            }
          })
          .join(' ');
        this.zone.run(() => {
          this.logs.unshift({
            id: ++this.logSeq,
            type: method,
            msg,
            time: new Date().toLocaleTimeString(),
          });
          if (this.logs.length > 200) this.logs.pop();
        });
      };
    });
  }

  private restoreConsole(): void {
    (['log', 'warn', 'error', 'info'] as LogType[]).forEach((m) => {
      if (this.origConsole[m]) (console as any)[m] = this.origConsole[m];
    });
  }

  limpiarLogs(): void {
    this.logs = [];
  }

  // ── Errors ──
  private interceptErrors(): void {
    this.errorHandler = (e: ErrorEvent) =>
      this.zone.run(() => {
        this.errors.unshift({
          id: ++this.errSeq,
          type: 'Uncaught Error',
          msg: `${e.message}\n${e.filename}:${e.lineno}`,
          time: new Date().toLocaleTimeString(),
        });
        this.errorCount++;
      });
    this.rejectionHandler = (e: PromiseRejectionEvent) =>
      this.zone.run(() => {
        const msg =
          e.reason instanceof Error
            ? `${e.reason.name}: ${e.reason.message}`
            : String(e.reason);
        this.errors.unshift({
          id: ++this.errSeq,
          type: 'Unhandled Promise',
          msg,
          time: new Date().toLocaleTimeString(),
        });
        this.errorCount++;
      });
    window.addEventListener('error', this.errorHandler);
    window.addEventListener('unhandledrejection', this.rejectionHandler as any);
  }

  // ── Network: Fetch ──
  private interceptFetch(): void {
    this.origFetch = window.fetch;
    const self = this;
    window.fetch = async function (...args: any[]) {
      const [resource, config] = args;
      const method = (config?.method ?? 'GET').toUpperCase();
      const url =
        typeof resource === 'string' ? resource : (resource as Request).url;
      const reqBody = config?.body ?? null;
      const start = performance.now();
      try {
        const response = await self.origFetch.apply(window, args as any);
        const cloned = response.clone();
        const duration = Math.round(performance.now() - start);
        let resText = '';
        try {
          resText = await cloned.text();
        } catch {}
        self.zone.run(() =>
          self.pushNetwork({
            method,
            url,
            status: response.status,
            duration,
            requestBody: reqBody,
            response: resText,
            ok: response.ok,
            time: new Date().toLocaleTimeString(),
          }),
        );
        return response;
      } catch (err: any) {
        const duration = Math.round(performance.now() - start);
        self.zone.run(() =>
          self.pushNetwork({
            method,
            url,
            duration,
            response: err?.message,
            ok: false,
            time: new Date().toLocaleTimeString(),
          }),
        );
        throw err;
      }
    };
  }

  // ── Network: XHR ──
  private interceptXHR(): void {
    this.origXhrOpen = XMLHttpRequest.prototype.open;
    this.origXhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL,
      ...rest: any[]
    ) {
      (this as any).__devMethod = method.toUpperCase();
      (this as any).__devUrl = url.toString();
      return (XMLHttpRequest.prototype as any).__origOpen.apply(this, [
        method,
        url,
        ...rest,
      ]);
    };
    (XMLHttpRequest.prototype as any).__origOpen = this.origXhrOpen;

    XMLHttpRequest.prototype.send = function (body?: any) {
      const start = performance.now();
      this.addEventListener('loadend', function () {
        const duration = Math.round(performance.now() - start);
        window.dispatchEvent(
          new CustomEvent('__dev_xhr__', {
            detail: {
              method: (this as any).__devMethod ?? 'XHR',
              url: (this as any).__devUrl ?? '',
              status: this.status,
              duration,
              requestBody: body ?? null,
              response: this.responseText,
              ok: this.status >= 200 && this.status < 300,
            },
          }),
        );
      });
      return (XMLHttpRequest.prototype as any).__origSend.apply(
        this,
        arguments,
      );
    };
    (XMLHttpRequest.prototype as any).__origSend = this.origXhrSend;

    this.xhrListener = ((e: any) => {
      this.zone.run(() => this.pushNetwork(e.detail));
    }) as EventListener;
    window.addEventListener('__dev_xhr__', this.xhrListener);
  }

  private pushNetwork(
    data: Omit<NetworkEntry, 'id' | 'expanded' | 'prettyResponse' | 'time'> & {
      time?: string;
    },
  ): void {
    if (!data.time) data.time = new Date().toLocaleTimeString();
    let prettyResponse: string | undefined;
    try {
      const parsed = JSON.parse(data.response ?? '');
      prettyResponse = JSON.stringify(parsed, null, 2);
    } catch {}
    this.network.unshift({
      ...data,
      id: ++this.netSeq,
      expanded: false,
      prettyResponse,
      time: data.time!,
    });
    if (this.network.length > 200) this.network.pop();
  }

  get filteredNetwork(): NetworkEntry[] {
    return this.network.filter((n) => {
      const methodOk = this.netFilter === 'ALL' || n.method === this.netFilter;
      const searchOk =
        !this.netSearch ||
        n.url.toLowerCase().includes(this.netSearch.toLowerCase());
      return methodOk && searchOk;
    });
  }

  copiarTexto(text?: string, key?: string): void {
    if (!text) return;

    const done = () => {
      this.copyState = key ?? null;

      setTimeout(() => {
        this.copyState = null;
      }, 1400);
    };

    // Clipboard API moderna
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(done)
        .catch(() => this.fallbackCopy(text, done));

      return;
    }

    // fallback
    this.fallbackCopy(text, done);
  }

  private fallbackCopy(text: string, done?: () => void): void {
    try {
      const textarea = document.createElement('textarea');

      textarea.value = text;

      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      document.execCommand('copy');

      document.body.removeChild(textarea);

      done?.();
    } catch (e) {
      console.error('copy failed', e);
    }
  }

  // ── Eval ──
  runEval(): void {
    if (!this.evalInput.trim()) return;
    this.evalHistory.unshift(this.evalInput);
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const result = new Function(this.evalInput)();
      this.evalResult =
        result === undefined
          ? 'undefined'
          : typeof result === 'object'
            ? JSON.stringify(result, null, 2)
            : String(result);
      this.evalError = false;
    } catch (e: any) {
      this.evalResult = e.message;
      this.evalError = true;
    }
  }

  historialUp(e: Event): void {
    e.preventDefault();
    if (this.evalHistory.length) this.evalInput = this.evalHistory[0];
  }

  // ── UI helpers ──
  logColor(t: LogType): string {
    return {
      log: '#94a3b8',
      warn: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
    }[t];
  }
  logBg(t: LogType): string {
    return {
      log: 'transparent',
      warn: 'rgba(251,191,36,0.05)',
      error: 'rgba(239,68,68,0.07)',
      info: 'rgba(96,165,250,0.05)',
    }[t];
  }
  logIcon(t: LogType): string {
    return { log: '›', warn: '⚠', error: '✖', info: 'ℹ' }[t];
  }

  statusColor(status?: number): string {
    if (!status) return '#f87171';
    if (status < 300) return '#34d399';
    if (status < 400) return '#fbbf24';
    return '#f87171';
  }

  methodColor(m: string): string {
    return (
      (
        {
          GET: '#34d399',
          POST: '#60a5fa',
          PUT: '#fbbf24',
          DELETE: '#f87171',
          PATCH: '#a78bfa',
        } as any
      )[m] ?? '#94a3b8'
    );
  }

  methodBg(m: string): string {
    return (
      (
        {
          GET: 'rgba(52,211,153,0.12)',
          POST: 'rgba(96,165,250,0.12)',
          PUT: 'rgba(251,191,36,0.12)',
          DELETE: 'rgba(239,68,68,0.12)',
          PATCH: 'rgba(167,139,250,0.12)',
        } as any
      )[m] ?? 'rgba(148,163,184,0.1)'
    );
  }
}
