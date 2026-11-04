-- SQL generado desde Prisma schema
-- Crea primero la base de datos:
-- CREATE DATABASE note_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE note_manager;

-- ── TABLAS PRINCIPALES ────────────────────────────────────────────────────

CREATE TABLE `Usuario` (
    `codigo` VARCHAR(191) NOT NULL,
    `cedula` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `celular` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `estado` INTEGER NOT NULL DEFAULT 1,
    `dependencia` VARCHAR(191) NULL,
    `centroCosto` VARCHAR(191) NULL,
    `cargo` VARCHAR(191) NULL,
    `empresa` VARCHAR(191) NULL,
    `rol` VARCHAR(191) NULL,
    `tipoContrato` VARCHAR(191) NULL,
    `fechaIngreso` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Usuario_cedula_key`(`cedula`),
    UNIQUE INDEX `Usuario_correo_key`(`correo`),
    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `empresas` (
    `nit` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `usuario_codigo` VARCHAR(191) NULL,
    PRIMARY KEY (`nit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `centros_costo` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `empresa_nit` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── DOCUMENTOS ────────────────────────────────────────────────────────────

CREATE TABLE `documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `contenido` VARCHAR(191) NULL,
    `categoria` VARCHAR(191) NULL,
    `empresa` VARCHAR(191) NULL,
    `publico` BOOLEAN NOT NULL DEFAULT false,
    `creado_por` VARCHAR(191) NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `documentos_permisos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documento_id` INTEGER NOT NULL,
    `codigo_colab` VARCHAR(191) NOT NULL,
    `tipo` INTEGER NOT NULL,
    UNIQUE INDEX `documentos_permisos_documento_id_codigo_colab_key`(`documento_id`, `codigo_colab`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `documentos_imagenes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documento_id` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tipos_permiso_documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `ver` BOOLEAN NOT NULL DEFAULT false,
    `crear` BOOLEAN NOT NULL DEFAULT false,
    `actualizar` BOOLEAN NOT NULL DEFAULT false,
    `eliminar` BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── TABLEROS KANBAN ───────────────────────────────────────────────────────

CREATE TABLE `tableros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `icono` VARCHAR(191) NULL,
    `visibilidad` VARCHAR(191) NOT NULL DEFAULT 'privado',
    `equipo_id` INTEGER NULL,
    `propietario` VARCHAR(191) NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `columnas_tablero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tablero_id` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `posicion` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `etiquetas_tablero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tablero_id` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tableros_miembros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tablero_id` INTEGER NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `rol` VARCHAR(191) NOT NULL DEFAULT 'editor',
    UNIQUE INDEX `tableros_miembros_tablero_id_codigo_key`(`tablero_id`, `codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── TAREAS ────────────────────────────────────────────────────────────────

CREATE TABLE `tareas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tablero_id` INTEGER NOT NULL,
    `columna_id` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `prioridad` VARCHAR(191) NOT NULL DEFAULT 'media',
    `posicion` INTEGER NOT NULL DEFAULT 0,
    `fecha_inicio` DATETIME(3) NULL,
    `fecha_vencimiento` DATETIME(3) NULL,
    `fecha_completada` DATETIME(3) NULL,
    `origen` VARCHAR(191) NOT NULL DEFAULT 'manual',
    `reunion_id` VARCHAR(191) NULL,
    `creado_por` VARCHAR(191) NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tareas_asignados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_id` INTEGER NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `fecha_asignacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `tareas_asignados_tarea_id_codigo_key`(`tarea_id`, `codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tareas_etiquetas` (
    `tarea_id` INTEGER NOT NULL,
    `etiqueta_id` INTEGER NOT NULL,
    PRIMARY KEY (`tarea_id`, `etiqueta_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tareas_comentarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_id` INTEGER NOT NULL,
    `autor_codigo` VARCHAR(191) NOT NULL,
    `comentario` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `editado` BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tareas_checklists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_id` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `posicion` INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `checklist_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `checklist_id` INTEGER NOT NULL,
    `texto` VARCHAR(191) NOT NULL,
    `completado` BOOLEAN NOT NULL DEFAULT false,
    `posicion` INTEGER NOT NULL DEFAULT 0,
    `completado_por` VARCHAR(191) NULL,
    `fecha_completado` DATETIME(3) NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tareas_archivos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_id` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `nombre_original` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `tamanio` INTEGER NULL,
    `mime` VARCHAR(191) NULL,
    `subido_por` VARCHAR(191) NULL,
    `fecha_subida` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tareas_recordatorios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_id` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `mensaje` VARCHAR(191) NULL,
    `notificado` BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tareas_historial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_id` INTEGER NOT NULL,
    `accion` VARCHAR(191) NOT NULL,
    `detalle` VARCHAR(191) NULL,
    `autor_codigo` VARCHAR(191) NOT NULL,
    `autor_nombre` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tareas_auditoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_id` INTEGER NOT NULL,
    `usuario_codigo` VARCHAR(191) NOT NULL,
    `accion` VARCHAR(191) NOT NULL,
    `campo` VARCHAR(191) NULL,
    `valor_anterior` VARCHAR(191) NULL,
    `valor_nuevo` VARCHAR(191) NULL,
    `descripcion` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `notificaciones_tareas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `para_codigo` VARCHAR(191) NOT NULL,
    `de_codigo` VARCHAR(191) NOT NULL,
    `de_nombre` VARCHAR(191) NOT NULL,
    `referencia_id` INTEGER NOT NULL,
    `referencia_titulo` VARCHAR(191) NOT NULL,
    `leida` BOOLEAN NOT NULL DEFAULT false,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── EQUIPOS ────────────────────────────────────────────────────────────────

CREATE TABLE `equipos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `propietario` VARCHAR(191) NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `equipos_miembros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `equipo_id` INTEGER NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `rol` VARCHAR(191) NOT NULL DEFAULT 'miembro',
    UNIQUE INDEX `equipos_miembros_equipo_id_codigo_key`(`equipo_id`, `codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── RECORDATORIOS ─────────────────────────────────────────────────────────

CREATE TABLE `recordatorios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `tipo` VARCHAR(191) NOT NULL DEFAULT 'temporal',
    `alcance` VARCHAR(191) NOT NULL DEFAULT 'personal',
    `estado` VARCHAR(191) NOT NULL DEFAULT 'pendiente',
    `fecha_unica` DATETIME(3) NULL,
    `hora` VARCHAR(191) NULL,
    `frecuencia` VARCHAR(191) NULL,
    `dias_semana` VARCHAR(191) NULL,
    `dia_mes` INTEGER NULL,
    `intervalo_dias` INTEGER NULL,
    `fecha_inicio` DATETIME(3) NULL,
    `fecha_fin` DATETIME(3) NULL,
    `sin_fecha_fin` BOOLEAN NOT NULL DEFAULT true,
    `creado_por` VARCHAR(191) NOT NULL,
    `creado_por_nombre` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `proxima_ejecucion` DATETIME(3) NULL,
    `ultima_ejecucion` DATETIME(3) NULL,
    `total_ejecuciones` INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `recordatorios_destinatarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recordatorio_id` INTEGER NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `empresa` VARCHAR(191) NULL,
    `leido` BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `notificaciones_recordatorios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recordatorio_id` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `fecha_ejecucion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `leida` BOOLEAN NOT NULL DEFAULT false,
    `completada` BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── REUNIONES ─────────────────────────────────────────────────────────────

CREATE TABLE `reuniones` (
    `codigo` VARCHAR(191) NOT NULL,
    `tema` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `hora_inicio` VARCHAR(191) NOT NULL,
    `hora_fin` VARCHAR(191) NOT NULL,
    `empresa` VARCHAR(191) NOT NULL,
    `tipo_evento` INTEGER NULL,
    `tipo_reunion` INTEGER NULL,
    `objetivo` VARCHAR(191) NULL,
    `conclusiones` VARCHAR(191) NULL,
    `lugar` INTEGER NULL,
    `anfitrion` VARCHAR(191) NULL,
    `lider` VARCHAR(191) NULL,
    `secretario` VARCHAR(191) NULL,
    `estado` INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (`codigo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `asistencias_reunion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_reunion` VARCHAR(191) NOT NULL,
    `codigo_colab` VARCHAR(191) NOT NULL,
    `colaborador_nombre` VARCHAR(191) NOT NULL,
    `colaborador_cedula` VARCHAR(191) NOT NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `hora_registro` VARCHAR(191) NOT NULL,
    `confirmacion` VARCHAR(191) NOT NULL DEFAULT 'N',
    `observacion` VARCHAR(191) NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `reuniones_convocados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_reunion` VARCHAR(191) NOT NULL,
    `codigo_colab` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `reuniones_convocados_codigo_reunion_codigo_colab_key`(`codigo_reunion`, `codigo_colab`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `tipos_reunion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `lugares_reunion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `empresa` VARCHAR(191) NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── FK: LLAVES FORÁNEAS ───────────────────────────────────────────────────

ALTER TABLE `empresas` ADD CONSTRAINT `empresas_usuario_codigo_fkey` FOREIGN KEY (`usuario_codigo`) REFERENCES `Usuario`(`codigo`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `centros_costo` ADD CONSTRAINT `centros_costo_empresa_nit_fkey` FOREIGN KEY (`empresa_nit`) REFERENCES `empresas`(`nit`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_creado_por_fkey` FOREIGN KEY (`creado_por`) REFERENCES `Usuario`(`codigo`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `documentos_permisos` ADD CONSTRAINT `documentos_permisos_documento_id_fkey` FOREIGN KEY (`documento_id`) REFERENCES `documentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `documentos_permisos` ADD CONSTRAINT `documentos_permisos_codigo_colab_fkey` FOREIGN KEY (`codigo_colab`) REFERENCES `Usuario`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `documentos_imagenes` ADD CONSTRAINT `documentos_imagenes_documento_id_fkey` FOREIGN KEY (`documento_id`) REFERENCES `documentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tableros` ADD CONSTRAINT `tableros_propietario_fkey` FOREIGN KEY (`propietario`) REFERENCES `Usuario`(`codigo`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `columnas_tablero` ADD CONSTRAINT `columnas_tablero_tablero_id_fkey` FOREIGN KEY (`tablero_id`) REFERENCES `tableros`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `etiquetas_tablero` ADD CONSTRAINT `etiquetas_tablero_tablero_id_fkey` FOREIGN KEY (`tablero_id`) REFERENCES `tableros`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tableros_miembros` ADD CONSTRAINT `tableros_miembros_tablero_id_fkey` FOREIGN KEY (`tablero_id`) REFERENCES `tableros`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tableros_miembros` ADD CONSTRAINT `tableros_miembros_codigo_fkey` FOREIGN KEY (`codigo`) REFERENCES `Usuario`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `tareas` ADD CONSTRAINT `tareas_tablero_id_fkey` FOREIGN KEY (`tablero_id`) REFERENCES `tableros`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tareas` ADD CONSTRAINT `tareas_columna_id_fkey` FOREIGN KEY (`columna_id`) REFERENCES `columnas_tablero`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `tareas` ADD CONSTRAINT `tareas_creado_por_fkey` FOREIGN KEY (`creado_por`) REFERENCES `Usuario`(`codigo`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tareas_asignados` ADD CONSTRAINT `tareas_asignados_tarea_id_fkey` FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tareas_asignados` ADD CONSTRAINT `tareas_asignados_codigo_fkey` FOREIGN KEY (`codigo`) REFERENCES `Usuario`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `tareas_etiquetas` ADD CONSTRAINT `tareas_etiquetas_tarea_id_fkey` FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tareas_etiquetas` ADD CONSTRAINT `tareas_etiquetas_etiqueta_id_fkey` FOREIGN KEY (`etiqueta_id`) REFERENCES `etiquetas_tablero`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tareas_comentarios` ADD CONSTRAINT `tareas_comentarios_tarea_id_fkey` FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tareas_comentarios` ADD CONSTRAINT `tareas_comentarios_autor_codigo_fkey` FOREIGN KEY (`autor_codigo`) REFERENCES `Usuario`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `tareas_checklists` ADD CONSTRAINT `tareas_checklists_tarea_id_fkey` FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `checklist_items` ADD CONSTRAINT `checklist_items_checklist_id_fkey` FOREIGN KEY (`checklist_id`) REFERENCES `tareas_checklists`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `checklist_items` ADD CONSTRAINT `checklist_items_completado_por_fkey` FOREIGN KEY (`completado_por`) REFERENCES `Usuario`(`codigo`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tareas_archivos` ADD CONSTRAINT `tareas_archivos_tarea_id_fkey` FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tareas_recordatorios` ADD CONSTRAINT `tareas_recordatorios_tarea_id_fkey` FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tareas_historial` ADD CONSTRAINT `tareas_historial_tarea_id_fkey` FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tareas_auditoria` ADD CONSTRAINT `tareas_auditoria_tarea_id_fkey` FOREIGN KEY (`tarea_id`) REFERENCES `tareas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tareas_auditoria` ADD CONSTRAINT `tareas_auditoria_usuario_codigo_fkey` FOREIGN KEY (`usuario_codigo`) REFERENCES `Usuario`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `notificaciones_tareas` ADD CONSTRAINT `notificaciones_tareas_para_codigo_fkey` FOREIGN KEY (`para_codigo`) REFERENCES `Usuario`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `equipos` ADD CONSTRAINT `equipos_propietario_fkey` FOREIGN KEY (`propietario`) REFERENCES `Usuario`(`codigo`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `equipos_miembros` ADD CONSTRAINT `equipos_miembros_equipo_id_fkey` FOREIGN KEY (`equipo_id`) REFERENCES `equipos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `equipos_miembros` ADD CONSTRAINT `equipos_miembros_codigo_fkey` FOREIGN KEY (`codigo`) REFERENCES `Usuario`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `recordatorios_destinatarios` ADD CONSTRAINT `recordatorios_destinatarios_recordatorio_id_fkey` FOREIGN KEY (`recordatorio_id`) REFERENCES `recordatorios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `reuniones` ADD CONSTRAINT `reuniones_empresa_fkey` FOREIGN KEY (`empresa`) REFERENCES `empresas`(`nit`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `asistencias_reunion` ADD CONSTRAINT `asistencias_reunion_codigo_reunion_fkey` FOREIGN KEY (`codigo_reunion`) REFERENCES `reuniones`(`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `reuniones_convocados` ADD CONSTRAINT `reuniones_convocados_codigo_reunion_fkey` FOREIGN KEY (`codigo_reunion`) REFERENCES `reuniones`(`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;
