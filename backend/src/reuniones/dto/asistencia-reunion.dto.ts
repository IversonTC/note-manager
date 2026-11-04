import { IsString, IsOptional } from 'class-validator';

export class AsistenciaReunionDto {
  @IsString()
  confirmacion: string;

  @IsOptional()
  @IsString()
  observacion?: string;
}
