import { IsString, IsOptional, IsArray, ValidateNested, IsDateString, IsInt, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

class DestinatarioDto {
  @IsString()
  codigo: string;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  empresa?: string;
}

export class CrearRecordatorioDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  alcance?: string;

  @IsOptional()
  @IsString()
  hora?: string;

  @IsOptional()
  @IsDateString()
  fecha_unica?: string;

  @IsOptional()
  @IsString()
  frecuencia?: string;

  @IsOptional()
  @IsString()
  dias_semana?: string;

  @IsOptional()
  @IsInt()
  dia_mes?: number;

  @IsOptional()
  @IsInt()
  intervalo_dias?: number;

  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsOptional()
  @IsBoolean()
  sin_fecha_fin?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DestinatarioDto)
  destinatarios?: DestinatarioDto[];
}
