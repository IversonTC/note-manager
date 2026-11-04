import { IsString, IsInt, IsOptional } from 'class-validator';

export class CrearModuloDto {
  @IsString()
  modulo: string;

  @IsString()
  nombre: string;

  @IsInt()
  tipoModulo: number;

  @IsOptional()
  @IsString()
  enlace?: string;
}
