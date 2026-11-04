import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CrearAccionDto {
  @IsString()
  empresa: string;

  @IsInt()
  numero: number;

  @IsOptional()
  @IsInt()
  tipo_accion?: number;

  @IsOptional()
  @IsInt()
  origen?: number;

  @IsString()
  nom_tipo: string;

  @IsString()
  nom_origen: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  analisis?: string;

  @IsOptional()
  @IsString()
  evidencia?: string;

  @IsDateString()
  fecha_deteccion: string;

  @IsOptional()
  @IsString()
  nom_registrado_por?: string;
}
