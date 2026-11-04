import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class ActualizarDocumentoDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  contenido?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  publico?: boolean;
}
