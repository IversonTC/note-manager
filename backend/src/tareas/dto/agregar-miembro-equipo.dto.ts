import { IsString, IsOptional } from 'class-validator';

export class AgregarMiembroEquipoDto {
  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  rol?: string;
}
