import { IsString, IsOptional, IsInt, MinLength, IsArray } from 'class-validator';

export class CrearTareaDto {
  @IsInt()
  tableroId: number;

  @IsInt()
  columnaId: number;

  @IsString()
  @MinLength(1)
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  prioridad?: string;

  @IsOptional()
  @IsInt()
  posicion?: number;

  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @IsOptional()
  @IsString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsString()
  origen?: string;

  @IsOptional()
  @IsString()
  reunionId?: string;

  @IsOptional()
  @IsString()
  creadoPor?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  etiquetas?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  asignados?: string[];
}
