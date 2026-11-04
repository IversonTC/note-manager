import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CrearPlanDto {
  @IsString()
  empresa: string;

  @IsString()
  opt_nombre_propuesta: string;

  @IsOptional()
  @IsString()
  opt_descripcion?: string;

  @IsOptional()
  @IsString()
  opt_importancia?: string;

  @IsOptional()
  @IsString()
  opt_posible_mejora?: string;

  @IsOptional()
  @IsDateString()
  opt_fecha_seguimiento?: string;

  @IsOptional()
  @IsString()
  opt_pasos?: string;

  @IsOptional()
  @IsString()
  aliado?: string;

  @IsOptional()
  @IsString()
  nom_aliado?: string;

  @IsOptional()
  @IsString()
  tiempo?: string;

  @IsOptional()
  @IsString()
  valor_hora?: string;

  @IsOptional()
  @IsString()
  opt_conclusion?: string;
}
