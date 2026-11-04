import { IsString, IsOptional, IsInt } from 'class-validator';

export class EncabezadoDto {
  @IsInt()
  formato: number;

  @IsString()
  empresa: string;

  @IsString()
  sgc_titulo1: string;

  @IsString()
  sgc_titulo2: string;

  @IsString()
  sgc_titulo3: string;

  @IsString()
  sgc_codigo: string;

  @IsString()
  sgc_version: string;

  @IsString()
  sgc_fecha: string;

  @IsOptional()
  @IsString()
  icono?: string;

  @IsString()
  nom_empresa: string;
}
