import { PrismaService } from '../prisma/prisma.service';
import { CrearTableroDto } from './dto/crear-tablero.dto';
import { CrearTareaDto } from './dto/crear-tarea.dto';
import { CrearColumnaDto } from './dto/crear-columna.dto';
import { CrearEtiquetaDto } from './dto/crear-etiqueta.dto';
import { CrearComentarioDto } from './dto/crear-comentario.dto';
import { CrearChecklistDto } from './dto/crear-checklist.dto';
import { CrearItemChecklistDto } from './dto/crear-item-checklist.dto';
import { CrearRecordatorioDto } from './dto/crear-recordatorio.dto';
import { CrearEquipoDto } from './dto/crear-equipo.dto';
import { MoverTareaDto } from './dto/mover-tarea.dto';
import { ReordenarColumnasDto } from './dto/reordenar-columnas.dto';
import { AgregarMiembroDto } from './dto/agregar-miembro.dto';
import { AgregarAsignadoDto } from './dto/agregar-asignado.dto';
import { AgregarMiembroEquipoDto } from './dto/agregar-miembro-equipo.dto';
import { ActualizarEtiquetasDto } from './dto/actualizar-etiquetas.dto';
export declare class TareasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllTableros(codigo_colab?: string): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            miembros: number;
            tareas: number;
        };
        miembros: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            rol: string;
            id: number;
            tableroId: number;
        })[];
    } & {
        nombre: string;
        id: number;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
        icono: string | null;
        visibilidad: string;
        equipoId: number | null;
    })[]>;
    findOneTablero(id: number): Promise<{
        _count: {
            tareas: number;
        };
        miembros: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            rol: string;
            id: number;
            tableroId: number;
        })[];
        columnas: {
            nombre: string;
            id: number;
            color: string | null;
            posicion: number;
            tableroId: number;
        }[];
        etiquetas: {
            nombre: string;
            id: number;
            color: string;
            tableroId: number;
        }[];
    } & {
        nombre: string;
        id: number;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
        icono: string | null;
        visibilidad: string;
        equipoId: number | null;
    }>;
    createTablero(dto: CrearTableroDto): Promise<{
        miembros: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            rol: string;
            id: number;
            tableroId: number;
        })[];
        columnas: {
            nombre: string;
            id: number;
            color: string | null;
            posicion: number;
            tableroId: number;
        }[];
        etiquetas: {
            nombre: string;
            id: number;
            color: string;
            tableroId: number;
        }[];
    } & {
        nombre: string;
        id: number;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
        icono: string | null;
        visibilidad: string;
        equipoId: number | null;
    }>;
    updateTablero(id: number, dto: Partial<CrearTableroDto>): Promise<{
        miembros: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            rol: string;
            id: number;
            tableroId: number;
        })[];
        columnas: {
            nombre: string;
            id: number;
            color: string | null;
            posicion: number;
            tableroId: number;
        }[];
        etiquetas: {
            nombre: string;
            id: number;
            color: string;
            tableroId: number;
        }[];
    } & {
        nombre: string;
        id: number;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
        icono: string | null;
        visibilidad: string;
        equipoId: number | null;
    }>;
    deleteTablero(id: number): Promise<{
        nombre: string;
        id: number;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
        icono: string | null;
        visibilidad: string;
        equipoId: number | null;
    }>;
    findKanban(id: number): Promise<{
        miembros: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            rol: string;
            id: number;
            tableroId: number;
        })[];
        columnas: ({
            tareas: ({
                creador: {
                    empresa: string | null;
                    centroCosto: string | null;
                    codigo: string;
                    cedula: string;
                    correo: string;
                    nombre: string;
                    celular: string | null;
                    password: string;
                    estado: number;
                    dependencia: string | null;
                    cargo: string | null;
                    rol: string | null;
                    tipoContrato: string | null;
                    fechaIngreso: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
                _count: {
                    comentarios: number;
                };
                etiquetas: ({
                    etiqueta: {
                        nombre: string;
                        id: number;
                        color: string;
                        tableroId: number;
                    };
                } & {
                    etiquetaId: number;
                    tareaId: number;
                })[];
                asignados: ({
                    usuario: {
                        empresa: string | null;
                        centroCosto: string | null;
                        codigo: string;
                        cedula: string;
                        correo: string;
                        nombre: string;
                        celular: string | null;
                        password: string;
                        estado: number;
                        dependencia: string | null;
                        cargo: string | null;
                        rol: string | null;
                        tipoContrato: string | null;
                        fechaIngreso: Date | null;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    codigo: string;
                    id: number;
                    fechaAsignacion: Date;
                    tareaId: number;
                })[];
            } & {
                id: number;
                titulo: string;
                creadoPor: string | null;
                fechaCreacion: Date;
                fechaActualizacion: Date;
                descripcion: string | null;
                posicion: number;
                tableroId: number;
                columnaId: number;
                prioridad: string;
                fechaInicio: Date | null;
                fechaVencimiento: Date | null;
                fechaCompletada: Date | null;
                origen: string;
                reunionId: string | null;
            })[];
        } & {
            nombre: string;
            id: number;
            color: string | null;
            posicion: number;
            tableroId: number;
        })[];
        etiquetas: {
            nombre: string;
            id: number;
            color: string;
            tableroId: number;
        }[];
    } & {
        nombre: string;
        id: number;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
        icono: string | null;
        visibilidad: string;
        equipoId: number | null;
    }>;
    createColumna(tableroId: number, dto: CrearColumnaDto): Promise<{
        nombre: string;
        id: number;
        color: string | null;
        posicion: number;
        tableroId: number;
    }>;
    reordenarColumnas(tableroId: number, dto: ReordenarColumnasDto): Promise<{
        nombre: string;
        id: number;
        color: string | null;
        posicion: number;
        tableroId: number;
    }[]>;
    updateColumna(tableroId: number, colId: number, dto: Partial<CrearColumnaDto>): Promise<{
        nombre: string;
        id: number;
        color: string | null;
        posicion: number;
        tableroId: number;
    }>;
    deleteColumna(tableroId: number, colId: number): Promise<{
        nombre: string;
        id: number;
        color: string | null;
        posicion: number;
        tableroId: number;
    }>;
    findEtiquetas(tableroId: number): Promise<{
        nombre: string;
        id: number;
        color: string;
        tableroId: number;
    }[]>;
    createEtiqueta(tableroId: number, dto: CrearEtiquetaDto): Promise<{
        nombre: string;
        id: number;
        color: string;
        tableroId: number;
    }>;
    updateEtiqueta(tableroId: number, etId: number, dto: Partial<CrearEtiquetaDto>): Promise<{
        nombre: string;
        id: number;
        color: string;
        tableroId: number;
    }>;
    deleteEtiqueta(tableroId: number, etId: number): Promise<{
        nombre: string;
        id: number;
        color: string;
        tableroId: number;
    }>;
    findMiembros(tableroId: number): Promise<({
        usuario: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        codigo: string;
        rol: string;
        id: number;
        tableroId: number;
    })[]>;
    addMiembro(tableroId: number, dto: AgregarMiembroDto): Promise<{
        usuario: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        codigo: string;
        rol: string;
        id: number;
        tableroId: number;
    }>;
    removeMiembro(tableroId: number, codigo: string): Promise<{
        codigo: string;
        rol: string;
        id: number;
        tableroId: number;
    }>;
    findAll(filters: {
        tablero_id?: number;
        prioridad?: string;
        buscar?: string;
        vencidas?: string;
        columna_id?: number;
        asignado?: string;
    }): import("@prisma/client").Prisma.PrismaPromise<({
        tablero: {
            nombre: string;
            id: number;
            fechaCreacion: Date;
            fechaActualizacion: Date;
            propietario: string | null;
            descripcion: string | null;
            color: string | null;
            icono: string | null;
            visibilidad: string;
            equipoId: number | null;
        };
        creador: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        _count: {
            comentarios: number;
            checklists: number;
            archivos: number;
        };
        etiquetas: ({
            etiqueta: {
                nombre: string;
                id: number;
                color: string;
                tableroId: number;
            };
        } & {
            etiquetaId: number;
            tareaId: number;
        })[];
        columna: {
            nombre: string;
            id: number;
            color: string | null;
            posicion: number;
            tableroId: number;
        };
        asignados: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            id: number;
            fechaAsignacion: Date;
            tareaId: number;
        })[];
    } & {
        id: number;
        titulo: string;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        descripcion: string | null;
        posicion: number;
        tableroId: number;
        columnaId: number;
        prioridad: string;
        fechaInicio: Date | null;
        fechaVencimiento: Date | null;
        fechaCompletada: Date | null;
        origen: string;
        reunionId: string | null;
    })[]>;
    findOne(id: number): Promise<{
        tablero: {
            nombre: string;
            id: number;
            fechaCreacion: Date;
            fechaActualizacion: Date;
            propietario: string | null;
            descripcion: string | null;
            color: string | null;
            icono: string | null;
            visibilidad: string;
            equipoId: number | null;
        };
        comentarios: ({
            autor: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            fecha: Date;
            tareaId: number;
            autorCodigo: string;
            comentario: string;
            editado: boolean;
        })[];
        auditorias: {
            createdAt: Date;
            id: number;
            descripcion: string | null;
            accion: string;
            campo: string | null;
            valorAnterior: string | null;
            valorNuevo: string | null;
            ip: string | null;
            tareaId: number;
            usuarioCodigo: string;
        }[];
        creador: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        etiquetas: ({
            etiqueta: {
                nombre: string;
                id: number;
                color: string;
                tableroId: number;
            };
        } & {
            etiquetaId: number;
            tareaId: number;
        })[];
        columna: {
            nombre: string;
            id: number;
            color: string | null;
            posicion: number;
            tableroId: number;
        };
        asignados: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            id: number;
            fechaAsignacion: Date;
            tareaId: number;
        })[];
        checklists: ({
            items: {
                id: number;
                posicion: number;
                texto: string;
                completado: boolean;
                fechaCompletado: Date | null;
                checklistId: number;
                completadoPor: string | null;
            }[];
        } & {
            id: number;
            titulo: string;
            posicion: number;
            tareaId: number;
        })[];
        archivos: {
            nombre: string;
            id: number;
            url: string;
            fechaSubida: Date;
            tareaId: number;
            nombreOriginal: string | null;
            tamanio: number | null;
            mime: string | null;
            subidoPor: string | null;
        }[];
        recordatorios: {
            id: number;
            fecha: Date;
            tareaId: number;
            mensaje: string | null;
            notificado: boolean;
        }[];
        historiales: {
            id: number;
            fecha: Date;
            accion: string;
            tareaId: number;
            autorCodigo: string;
            detalle: string | null;
            autorNombre: string;
        }[];
    } & {
        id: number;
        titulo: string;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        descripcion: string | null;
        posicion: number;
        tableroId: number;
        columnaId: number;
        prioridad: string;
        fechaInicio: Date | null;
        fechaVencimiento: Date | null;
        fechaCompletada: Date | null;
        origen: string;
        reunionId: string | null;
    }>;
    create(dto: CrearTareaDto): Promise<{
        etiquetas: ({
            etiqueta: {
                nombre: string;
                id: number;
                color: string;
                tableroId: number;
            };
        } & {
            etiquetaId: number;
            tareaId: number;
        })[];
        asignados: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            id: number;
            fechaAsignacion: Date;
            tareaId: number;
        })[];
    } & {
        id: number;
        titulo: string;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        descripcion: string | null;
        posicion: number;
        tableroId: number;
        columnaId: number;
        prioridad: string;
        fechaInicio: Date | null;
        fechaVencimiento: Date | null;
        fechaCompletada: Date | null;
        origen: string;
        reunionId: string | null;
    }>;
    update(id: number, dto: any): Promise<{
        tablero: {
            nombre: string;
            id: number;
            fechaCreacion: Date;
            fechaActualizacion: Date;
            propietario: string | null;
            descripcion: string | null;
            color: string | null;
            icono: string | null;
            visibilidad: string;
            equipoId: number | null;
        };
        creador: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        etiquetas: ({
            etiqueta: {
                nombre: string;
                id: number;
                color: string;
                tableroId: number;
            };
        } & {
            etiquetaId: number;
            tareaId: number;
        })[];
        columna: {
            nombre: string;
            id: number;
            color: string | null;
            posicion: number;
            tableroId: number;
        };
        asignados: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            id: number;
            fechaAsignacion: Date;
            tareaId: number;
        })[];
    } & {
        id: number;
        titulo: string;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        descripcion: string | null;
        posicion: number;
        tableroId: number;
        columnaId: number;
        prioridad: string;
        fechaInicio: Date | null;
        fechaVencimiento: Date | null;
        fechaCompletada: Date | null;
        origen: string;
        reunionId: string | null;
    }>;
    delete(id: number): Promise<{
        id: number;
        titulo: string;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        descripcion: string | null;
        posicion: number;
        tableroId: number;
        columnaId: number;
        prioridad: string;
        fechaInicio: Date | null;
        fechaVencimiento: Date | null;
        fechaCompletada: Date | null;
        origen: string;
        reunionId: string | null;
    }>;
    mover(id: number, dto: MoverTareaDto): Promise<{
        etiquetas: ({
            etiqueta: {
                nombre: string;
                id: number;
                color: string;
                tableroId: number;
            };
        } & {
            etiquetaId: number;
            tareaId: number;
        })[];
        columna: {
            nombre: string;
            id: number;
            color: string | null;
            posicion: number;
            tableroId: number;
        };
        asignados: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            id: number;
            fechaAsignacion: Date;
            tareaId: number;
        })[];
    } & {
        id: number;
        titulo: string;
        creadoPor: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        descripcion: string | null;
        posicion: number;
        tableroId: number;
        columnaId: number;
        prioridad: string;
        fechaInicio: Date | null;
        fechaVencimiento: Date | null;
        fechaCompletada: Date | null;
        origen: string;
        reunionId: string | null;
    }>;
    updateEtiquetas(id: number, dto: ActualizarEtiquetasDto): Promise<({
        etiqueta: {
            nombre: string;
            id: number;
            color: string;
            tableroId: number;
        };
    } & {
        etiquetaId: number;
        tareaId: number;
    })[]>;
    addAsignado(id: number, dto: AgregarAsignadoDto): Promise<{
        usuario: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        codigo: string;
        id: number;
        fechaAsignacion: Date;
        tareaId: number;
    }>;
    removeAsignado(id: number, codigo: string): Promise<{
        codigo: string;
        id: number;
        fechaAsignacion: Date;
        tareaId: number;
    }>;
    findComentarios(id: number): Promise<({
        autor: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        fecha: Date;
        tareaId: number;
        autorCodigo: string;
        comentario: string;
        editado: boolean;
    })[]>;
    addComentario(id: number, dto: CrearComentarioDto & {
        codigo_colab?: string;
    }): Promise<{
        autor: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        fecha: Date;
        tareaId: number;
        autorCodigo: string;
        comentario: string;
        editado: boolean;
    }>;
    updateComentario(id: number, comentarioId: number, dto: CrearComentarioDto): Promise<{
        autor: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        fecha: Date;
        tareaId: number;
        autorCodigo: string;
        comentario: string;
        editado: boolean;
    }>;
    deleteComentario(id: number, comentarioId: number): Promise<{
        id: number;
        fecha: Date;
        tareaId: number;
        autorCodigo: string;
        comentario: string;
        editado: boolean;
    }>;
    findArchivos(id: number): Promise<{
        nombre: string;
        id: number;
        url: string;
        fechaSubida: Date;
        tareaId: number;
        nombreOriginal: string | null;
        tamanio: number | null;
        mime: string | null;
        subidoPor: string | null;
    }[]>;
    addArchivo(id: number, file: Express.Multer.File): Promise<{
        nombre: string;
        id: number;
        url: string;
        fechaSubida: Date;
        tareaId: number;
        nombreOriginal: string | null;
        tamanio: number | null;
        mime: string | null;
        subidoPor: string | null;
    }>;
    deleteArchivo(id: number, archivoId: number): Promise<{
        nombre: string;
        id: number;
        url: string;
        fechaSubida: Date;
        tareaId: number;
        nombreOriginal: string | null;
        tamanio: number | null;
        mime: string | null;
        subidoPor: string | null;
    }>;
    findChecklists(id: number): Promise<({
        items: {
            id: number;
            posicion: number;
            texto: string;
            completado: boolean;
            fechaCompletado: Date | null;
            checklistId: number;
            completadoPor: string | null;
        }[];
    } & {
        id: number;
        titulo: string;
        posicion: number;
        tareaId: number;
    })[]>;
    createChecklist(id: number, dto: CrearChecklistDto): Promise<{
        items: {
            id: number;
            posicion: number;
            texto: string;
            completado: boolean;
            fechaCompletado: Date | null;
            checklistId: number;
            completadoPor: string | null;
        }[];
    } & {
        id: number;
        titulo: string;
        posicion: number;
        tareaId: number;
    }>;
    deleteChecklist(id: number, checklistId: number): Promise<{
        id: number;
        titulo: string;
        posicion: number;
        tareaId: number;
    }>;
    addItemChecklist(id: number, checklistId: number, dto: CrearItemChecklistDto): Promise<{
        id: number;
        posicion: number;
        texto: string;
        completado: boolean;
        fechaCompletado: Date | null;
        checklistId: number;
        completadoPor: string | null;
    }>;
    toggleItemChecklist(id: number, checklistId: number, itemId: number): Promise<{
        id: number;
        posicion: number;
        texto: string;
        completado: boolean;
        fechaCompletado: Date | null;
        checklistId: number;
        completadoPor: string | null;
    }>;
    deleteItemChecklist(id: number, checklistId: number, itemId: number): Promise<{
        id: number;
        posicion: number;
        texto: string;
        completado: boolean;
        fechaCompletado: Date | null;
        checklistId: number;
        completadoPor: string | null;
    }>;
    findRecordatorios(id: number): Promise<{
        id: number;
        fecha: Date;
        tareaId: number;
        mensaje: string | null;
        notificado: boolean;
    }[]>;
    createRecordatorio(id: number, dto: CrearRecordatorioDto): Promise<{
        id: number;
        fecha: Date;
        tareaId: number;
        mensaje: string | null;
        notificado: boolean;
    }>;
    deleteRecordatorio(id: number, recordatorioId: number): Promise<{
        id: number;
        fecha: Date;
        tareaId: number;
        mensaje: string | null;
        notificado: boolean;
    }>;
    findHistorial(id: number): Promise<{
        id: number;
        fecha: Date;
        accion: string;
        tareaId: number;
        autorCodigo: string;
        detalle: string | null;
        autorNombre: string;
    }[]>;
    findAuditoria(id: number, limite?: number): Promise<({
        usuario: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        createdAt: Date;
        id: number;
        descripcion: string | null;
        accion: string;
        campo: string | null;
        valorAnterior: string | null;
        valorNuevo: string | null;
        ip: string | null;
        tareaId: number;
        usuarioCodigo: string;
    })[]>;
    findNotificaciones(): import("@prisma/client").Prisma.PrismaPromise<({
        usuario: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        fechaCreacion: Date;
        tipo: string;
        paraCodigo: string;
        deCodigo: string;
        deNombre: string;
        referenciaId: number;
        referenciaTitulo: string;
        leida: boolean;
    })[]>;
    marcarNotificacionLeida(id: number): Promise<{
        id: number;
        fechaCreacion: Date;
        tipo: string;
        paraCodigo: string;
        deCodigo: string;
        deNombre: string;
        referenciaId: number;
        referenciaTitulo: string;
        leida: boolean;
    }>;
    marcarTodasLeidas(): Promise<{
        message: string;
    }>;
    getDashboard(): Promise<{
        total: number;
        completadas: number;
        pendientes: number;
        vencidas: number;
        porPrioridad: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.TareaGroupByOutputType, "prioridad"[]> & {
            _count: number;
        })[];
        totalTableros: number;
        totalEquipos: number;
    }>;
    findAllEquipos(): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            miembros: number;
        };
        miembros: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            rol: string;
            id: number;
            equipoId: number;
        })[];
    } & {
        nombre: string;
        id: number;
        fechaCreacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
    })[]>;
    findOneEquipo(id: number): Promise<{
        miembros: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            rol: string;
            id: number;
            equipoId: number;
        })[];
        propietarioRel: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        nombre: string;
        id: number;
        fechaCreacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
    }>;
    createEquipo(dto: CrearEquipoDto): Promise<{
        miembros: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            rol: string;
            id: number;
            equipoId: number;
        })[];
    } & {
        nombre: string;
        id: number;
        fechaCreacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
    }>;
    updateEquipo(id: number, dto: Partial<CrearEquipoDto>): Promise<{
        miembros: ({
            usuario: {
                empresa: string | null;
                centroCosto: string | null;
                codigo: string;
                cedula: string;
                correo: string;
                nombre: string;
                celular: string | null;
                password: string;
                estado: number;
                dependencia: string | null;
                cargo: string | null;
                rol: string | null;
                tipoContrato: string | null;
                fechaIngreso: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            codigo: string;
            rol: string;
            id: number;
            equipoId: number;
        })[];
    } & {
        nombre: string;
        id: number;
        fechaCreacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
    }>;
    deleteEquipo(id: number): Promise<{
        nombre: string;
        id: number;
        fechaCreacion: Date;
        propietario: string | null;
        descripcion: string | null;
        color: string | null;
    }>;
    findMiembrosEquipo(id: number): Promise<({
        usuario: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        codigo: string;
        rol: string;
        id: number;
        equipoId: number;
    })[]>;
    addMiembroEquipo(id: number, dto: AgregarMiembroEquipoDto): Promise<{
        usuario: {
            empresa: string | null;
            centroCosto: string | null;
            codigo: string;
            cedula: string;
            correo: string;
            nombre: string;
            celular: string | null;
            password: string;
            estado: number;
            dependencia: string | null;
            cargo: string | null;
            rol: string | null;
            tipoContrato: string | null;
            fechaIngreso: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        codigo: string;
        rol: string;
        id: number;
        equipoId: number;
    }>;
    removeMiembroEquipo(id: number, codigo: string): Promise<{
        codigo: string;
        rol: string;
        id: number;
        equipoId: number;
    }>;
}
