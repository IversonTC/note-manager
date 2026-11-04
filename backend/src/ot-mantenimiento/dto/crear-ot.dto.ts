import { IsString, IsOptional } from 'class-validator';

export class CrearOtDto {
  @IsString()
  otEmpresa: string;

  @IsString()
  otSolicitanteUbicacion: string;

  @IsString()
  otSolicitanteDescripcion: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  eotNombre?: string;
}
