import { IsString, IsOptional, IsInt, IsDateString, IsArray } from 'class-validator';

export class CrearReunionDto {
  @IsString()
  tema: string;

  @IsDateString()
  fecha: string;

  @IsString()
  hora_inicio: string;

  @IsString()
  hora_fin: string;

  @IsString()
  empresa: string;

  @IsOptional()
  @IsInt()
  tipo_evento?: number;

  @IsOptional()
  @IsInt()
  tipo_reunion?: number;

  @IsOptional()
  @IsString()
  objetivo?: string;

  @IsOptional()
  @IsString()
  conclusiones?: string;

  @IsOptional()
  @IsInt()
  lugar?: number;

  @IsOptional()
  @IsString()
  anfitrion?: string;

  @IsOptional()
  @IsString()
  lider?: string;

  @IsOptional()
  @IsString()
  secretario?: string;

  @IsOptional()
  @IsInt()
  estado?: number;
}
