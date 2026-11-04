import { IsString, IsOptional } from 'class-validator';

export class CrearRecordatorioDto {
  @IsString()
  codigo_colab: string;

  @IsString()
  fecha: string;

  @IsOptional()
  @IsString()
  mensaje?: string;
}
