import { IsString, IsOptional } from 'class-validator';

export class CrearSeguimientoDto {
  @IsString()
  actividad: string;

  @IsOptional()
  @IsString()
  nom_responsable?: string;

  @IsString()
  fecha_seguimiento: string;
}
