import { IsString, IsOptional, IsArray, ValidateNested, IsInt, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class MiembroInicialDto {
  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  rol?: string;
}

export class CrearTableroDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icono?: string;

  @IsOptional()
  @IsString()
  visibilidad?: string;

  @IsOptional()
  @IsInt()
  equipoId?: number;

  @IsOptional()
  @IsString()
  propietario?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MiembroInicialDto)
  miembros_iniciales?: MiembroInicialDto[];
}
