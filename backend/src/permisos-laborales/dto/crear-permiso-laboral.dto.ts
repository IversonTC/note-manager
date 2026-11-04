import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CrearPermisoLaboralDto {
  @IsString()
  codigo_colab: string;

  @IsString()
  colaborador_nombre: string;

  @IsDateString()
  fecha_salida: string;

  @IsDateString()
  fecha_final: string;

  @IsString()
  tipo_permiso: string;

  @IsOptional()
  @IsString()
  tipo_nombre?: string;

  @IsInt()
  duracion: number;

  @IsOptional()
  @IsString()
  compensado?: string;

  @IsOptional()
  @IsString()
  remunerado?: string;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @IsString()
  remitir_autoriza?: string;

  @IsOptional()
  @IsString()
  empresa?: string;
}
